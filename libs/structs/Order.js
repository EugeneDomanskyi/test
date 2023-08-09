import numeral from 'numeral'
import { formatUnits, encodeFunctionData, parseUnits } from 'viem'
import { getClient } from '@reservoir0x/reservoir-sdk'
import { getWalletClient, waitForTransaction, sendTransaction } from '@wagmi/core'
import { LimitOrderProtocolFacade } from '@1inch/limit-order-protocol-utils'
import { toast } from 'react-toastify'

import { CHAINS, INCH_CONTRACTS } from '@/config'

class Order {

  static showSuccessMessage = (message) => {
    toast.success(message)
  }

  static getWalletData = async () => {
    const walletClient = await getWalletClient()
    const chainId = await walletClient.getChainId()
    return { walletClient, chainId }
  }
}

class NFT extends Order {
  constructor(data) {
    super()
    this.id = data.id
    this.contractAddress = data.contract.toLowerCase()
    this.quantityRemaining = data.quantityRemaining
    this.quantityFilled = data.quantityFilled
    this.baseCurrency = data.price.currency.symbol
    this.quoteCurrency = data.criteria.data.collection.name
    this.price = data.price.amount.decimal
    this.side = data.side
    this.image = data.criteria.data.token?.image ?? data.criteria.data.collection?.image
  }

  get quantity () {
    return numeral(this.quantityRemaining).add(this.quantityFilled).value()
  }

  get itemPrice () {
    return numeral(this.price).divide(this.quantity).value()
  }

  static place = ({address, price, amount}) => {
    return new Promise(async (resolve, reject) => {
      const { walletClient, chainId } = await Order.getWalletData()
      const blockchain = CHAINS.find(chain => chain.id === chainId)
      const bids = [{
        weiPrice: parseUnits(`${price}`, 18).toString(),
        collection: address,
        quantity: amount,
        royaltyBps: 0,
        currency: blockchain.wrapped.contract,
      }]

      let completed = false

      const onComplete = () => {
        if (!completed) {
          completed = true
          resolve()
          Order.showSuccessMessage('Order placed successfully')
        }
      }

      getClient()?.actions.placeBid({
        bids: bids,
        wallet: walletClient,
        chainId,
        onProgress: NFT.onProgress(onComplete)
      }).catch(reject)
    })
  }

  static onProgress = (resolver) => (steps) => {
    const isAllStepsComplete = steps.flatMap(step => step.items).every(step => step.status === 'complete')
    if (isAllStepsComplete) {
      resolver()
    }
  }

  cancel = () => {
    return new Promise(async (resolve, reject) => {
      const { walletClient, chainId } = await Order.getWalletData()

      let completed = false

      const onComplete = () => {
        if (!completed) {
          completed = true
          resolve()
          Order.showSuccessMessage('Order cancel successfully')
        }
      }
      
      getClient()?.actions.cancelOrder({
        ids: [this.id],
        wallet: walletClient,
        chainId,
        options: { orderKind: 'seaport-v1.5'},
        onProgress: NFT.onProgress(onComplete),
      }).catch(reject)
    })
  }
}

class TOKEN extends Order {
  constructor(data) {
    super()
    this.rawData = data
    const network = CHAINS.find(chain => chain.code === data.network)
    this.id = data.signature
    this.side = network.usdtContract.toLowerCase() === data.data.makerAsset.toLowerCase() ? 'buy' : 'sell'
    const buyCurrency = this.side === 'buy' ? 'makingAmount' : 'takingAmount'
    const sellCurrency = this.side === 'sell' ? 'makingAmount' : 'takingAmount'
    this.baseCurrency = 'USDT'
    this.quoteCurrency = 'Token'
    this.contractAddress = this.side === 'buy' ? data.data.takerAsset.toLowerCase() : data.data.makerAsset.toLowerCase()
    this.quantity = formatUnits(data.data[sellCurrency], 18)
    this.quantityFilled = formatUnits(data.data.makingAmount - data.remainingMakerAmount, 6)
    this.price = formatUnits(data.data[buyCurrency], 6)
    // this.image = data.criteria.data.token?.image ?? data.criteria.data.collection?.image
  }

  get itemPrice () {
    return numeral(this.price).divide(this.quantity).format('0.0[000]')
  }

  cancel = () => {
    return new Promise(async (resolve, reject) => {
      const { chainId } = await this.getWalletData()
      const contractEncodeABI = (abi, address, methodName, methodParams) => {
        return encodeFunctionData({abi: abi, functionName: methodName, args: methodParams})
      }
      const limitOrderProtocolFacade = new LimitOrderProtocolFacade(INCH_CONTRACTS[chainId], chainId, {contractEncodeABI})
      const callData = limitOrderProtocolFacade.cancelLimitOrder(this.rawData.data)
      const res = await sendTransaction({
        chainId: chainId,
        to: INCH_CONTRACTS[chainId],
        data: callData,
      })
      const txResult = await waitForTransaction(res)
      resolve(txResult)
      this.showSuccessMessage('Order cancelled successfully')
    })
  }
}

export default { NFT, TOKEN }
