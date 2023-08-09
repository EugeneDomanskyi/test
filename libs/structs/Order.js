import numeral from 'numeral'
import { formatUnits, encodeFunctionData } from 'viem'
import { getClient } from '@reservoir0x/reservoir-sdk'
import { getWalletClient, waitForTransaction, sendTransaction } from '@wagmi/core'
import { LimitOrderProtocolFacade } from '@1inch/limit-order-protocol-utils'
import { toast } from 'react-toastify'

import { CHAINS, INCH_CONTRACTS } from '@/config'

class Order {
  showSuccessMessage = () => {
    toast.success('Order cancelled successfully')
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

  cancel = () => {
    return new Promise(async (resolve, reject) => {
      const walletClient = await getWalletClient()
      const chainId = await walletClient.getChainId()
      getClient()?.actions.cancelOrder({
        ids: [this.id],
        wallet: walletClient,
        chainId,
        options: { orderKind: 'seaport-v1.5'},
        onProgress: this.onProgress(resolve),
      }).catch(reject)
    })
  }

  onProgress = (resolver) => (steps) => {
    const isAllStepsComplete = steps.flatMap(step => step.items).every(step => step.status === 'complete')
    if (isAllStepsComplete) {
      resolver()
      this.showSuccessMessage()
    }
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
      const walletClient = await getWalletClient()
      const chainId = await walletClient.getChainId()
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
      this.showSuccessMessage()
    })
  }
}

export default { NFT, TOKEN }
