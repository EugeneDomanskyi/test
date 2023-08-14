import numeral from 'numeral'
import { formatUnits, encodeFunctionData, parseUnits, hashTypedData } from 'viem'
import { getClient } from '@reservoir0x/reservoir-sdk'
import { getWalletClient, waitForTransaction, sendTransaction, signTypedData, readContract, fetchBalance } from '@wagmi/core'
import { LimitOrderProtocolFacade, LimitOrderBuilder } from '@1inch/limit-order-protocol-utils'
import { FusionSDK } from '@1inch/fusion-sdk'
import { toast } from 'react-toastify'

import { CHAINS, INCH_CONTRACTS, INCH_TOKENS } from '@/config'
import $orders from '@/store/orders'
import $nft from '@/store/nft'

const USDT_DECIMALS = 6

class Order {

  static showSuccessMessage = (message) => {
    toast.success(message)
  }

  static showErrorMessage = message => {
    toast.error(message)
  }

  static getBalance = async (wallet, address) => {
    const res = await fetchBalance({address: wallet, ...(address ? {token: address} : null)})
    return numeral(res.formatted).value()
  }

  static getWalletData = async () => {
    const walletClient = await getWalletClient()
    if (walletClient) {
      const chainId = await walletClient.getChainId()
      return { walletClient, chainId }
    }
    return { walletClient: {account: null}, chainId: null }
  }

  static getDecimals = async (address) => {
    const contractInfo = INCH_TOKENS[address]
    if (contractInfo) {
      return contractInfo.decimals
    }
    const abi = {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{name: '', type: 'uint8'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }
    const res = await readContract({
      address: address,
      abi: [abi],
      functionName: 'decimals',
    })
    return res
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

  static getQuote = async ({chainId, address, amount, side}) => {
    if (!amount) {
      return 0
    }
    const { walletClient } = await Order.getWalletData()
    const network = CHAINS.find(chain => chain.id === chainId)
    if (side === 'buy') {
      const response = await $nft.api.prices({blockchain: network.code, collection: address})
      if (response.tokens) {
        return Object.values(response.tokens).sort((a, b) => a - b).slice(0, amount).reduce((acc, price) => acc+price, 0)
      }
    } else {
      let continuation = null
      let result = []
      do {
        const response = await $nft.api.bids({
          blockchain: network.code,
          collection: address,
          sortBy: 'price',
          sortDirection: 'DESC',
          limit: 50,
          continuation,
          status: 'active',
        })
        if (response && response?.orders) {
          result = [...result, ...response.orders]
        }
        continuation = response?.continuation
      } while (continuation)

      return (
        result
          .filter(order => order.maker.toLowerCase() !== walletClient.account?.address?.toLowerCase())
          .flatMap(order => (new Array(order.quantityRemaining).fill(order.price.amount.native)))
          .slice(0, amount)
          .reduce((acc, price) => acc + price, 0)
      )
    }
    return 0
  }

  static fulfill = ({side, address, amount, nfts}) => {
    return new Promise(async (resolve, reject) => {
      const { walletClient, chainId } = await Order.getWalletData()
      const network = CHAINS.find(chain => chain.id === chainId)

      let completed = false

      const onComplete = () => {
        if (!completed) {
          completed = true
          resolve()
          Order.showSuccessMessage('Order placed successfully')
        }
      }

      if (side === 'buy') {
        const response = await $nft.api.prices({blockchain: network.code, collection: address})
        if (!response?.tokens) {
          reject()
          return
        }
        const nfts = Object.entries(response.tokens).sort((a,b) => a[1] - b[1]).slice(0, amount).map(([id]) => ({token: `${address}:${id}`, quantity: 1}))

        getClient()?.actions.buyToken({
          items: nfts,
          wallet: walletClient,
          options: {},
          chainId: chainId,
          onProgress: NFT.onProgress(onComplete),
        }).catch(reject)
        return
      }
      const items = nfts.map(token => ({token: `${address}:${token.id}`, quantity: token.amount}))
      getClient()?.actions.acceptOffer({
        items: items,
        wallet: walletClient,
        options: {},
        chainId: chainId,
        onProgress: NFT.onProgress(onComplete),
      }).catch(reject)
    })
  }

  static place = ({address, price, amount, nfts, type = 'buy'}) => {
    return new Promise(async (resolve, reject) => {
      const { walletClient, chainId } = await Order.getWalletData()
      const blockchain = CHAINS.find(chain => chain.id === chainId)

      let completed = false

      const onComplete = () => {
        if (!completed) {
          completed = true
          resolve()
          Order.showSuccessMessage('Order placed successfully')
        }
      }

      if (type === 'buy') {
        const bids = [{
          weiPrice: parseUnits(`${price}`, 18).toString(),
          collection: address,
          quantity: amount,
          royaltyBps: 0,
          currency: blockchain.wrapped.contract,
        }]

        getClient()?.actions.placeBid({
          bids: bids,
          wallet: walletClient,
          chainId,
          onProgress: NFT.onProgress(onComplete)
        }).catch(reject)
        return
      }

      const listing = nfts.map((token) => ({
        token: `${address}:${token.id}`,
        weiPrice: parseUnits(`${price}`, 18).toString(),
        quantity: token.amount,
        royaltyBps: 0,
        currency: blockchain.wrapped.contract,
      }))

      getClient()?.actions.listToken({
        listings: listing,
        wallet: walletClient,
        chainId,
        onProgress: NFT.onProgress(onComplete),
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
    const makerToken = INCH_TOKENS[data.data.makerAsset]
    const takerToken = INCH_TOKENS[data.data.takerAsset]
    
    const network = CHAINS.find(chain => chain.code === data.network)
    this.id = data.signature
    this.side = network.usdtContract.toLowerCase() === data.data.makerAsset.toLowerCase() ? 'buy' : 'sell'
    const buyCurrency = this.side === 'buy' ? 'makingAmount' : 'takingAmount'
    const sellCurrency = this.side === 'sell' ? 'makingAmount' : 'takingAmount'
    this.baseCurrency = 'USDT'
    this.quoteCurrency = this.side === 'sell' ? makerToken.symbol : takerToken.symbol
    this.contractAddress = this.side === 'buy' ? data.data.takerAsset.toLowerCase() : data.data.makerAsset.toLowerCase()
    this.quantity = numeral(formatUnits(data.data[sellCurrency], this.side === 'sell' ? makerToken.decimals : takerToken.decimals)).format('0.[0000]')
    this.quantityFilled = numeral(formatUnits(data.data.makingAmount - data.remainingMakerAmount, USDT_DECIMALS)).format('0.[0000]')
    this.price = numeral(formatUnits(data.data[buyCurrency], USDT_DECIMALS)).format('0.[0000]')
    this.image = this.side === 'sell' ? makerToken.logoURI : takerToken.logoURI
  }

  get itemPrice () {
    return numeral(this.price).divide(this.quantity).format('0.0[000]')
  }

  static getQuote = async ({chainId, address, amount, side}) => {
    if (!amount) {
      return 0
    }
    // const { walletClient } = await Order.getWalletData()
    const network = CHAINS.find(chain => chain.id === chainId)
    const sdk = new FusionSDK({url: 'https://fusion.1inch.io', network: chainId})
    const tokenDecimals = await Order.getDecimals(address)

    let fromToken = network.usdtContract
    let toToken = address
    let amountFrom = parseUnits(`${amount}`, USDT_DECIMALS)
    if (side === 'sell') {
      fromToken = address
      toToken = network.usdtContract
      amountFrom = parseUnits(`${amount}`, tokenDecimals)
    }
    const params = {
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      amount: amountFrom,
    }
    const quote = await sdk.getQuote(params).catch(error => {
      return {toTokenAmount: side === 'sell' ? 1000000 : 1000000000000000000}
    })
    return formatUnits(`${quote.toTokenAmount}`, side === 'buy' ? tokenDecimals : USDT_DECIMALS)
  }

  static swap = ({address, amount, side}) => {
    return new Promise(async (resolve, reject) => {
      const { chainId, walletClient } = await Order.getWalletData()
      const network = CHAINS.find(chain => chain.id === chainId)
      const tokenDecimals = await Order.getDecimals(address)

      walletClient.signTypedData = (address, typedData) => {
        return signTypedData(typedData)
      }
      const sdk = new FusionSDK({url: 'https://fusion.1inch.io', network: chainId, blockchainProvider: walletClient})

      let fromToken = network.usdtContract
      let toToken = address
      let amountFrom = parseUnits(`${amount}`, USDT_DECIMALS)
      if (side === 'sell') {
        fromToken = address
        toToken = network.usdtContract
        amountFrom = parseUnits(`${amount}`, tokenDecimals)
      }

      const balance = await Order.getBalance(walletClient.account.address, fromToken)
      if (balance < amount*1) {
        Order.showErrorMessage('Insufficient balance')
        reject()
        return 
      }

      sdk.placeOrder({
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount: amountFrom,
        walletAddress: walletClient.account.address
      }).then(res => {
        console.log(res)
        resolve()
      }).catch(reject)
    })
  }

  static place = ({address, price, amount, type = 'buy'}) => {
    return new Promise(async (resolve, reject) => {
      const { walletClient, chainId } = await Order.getWalletData()
      const limitOrderBuilder = new LimitOrderBuilder(INCH_CONTRACTS[chainId], chainId, walletClient)
      const network = CHAINS.find(chain => chain.id === chainId)

      const tokenDecimals = await Order.getDecimals(address)

      let sellAsset = network.usdtContract
      let buyAsset = address
      let sellAmount = parseUnits(`${price}`, USDT_DECIMALS).toString()
      let buyAmount = parseUnits(`${amount}`, tokenDecimals).toString()
      if (type === 'sell') {
        sellAsset = address
        buyAsset = network.usdtContract
        sellAmount = parseUnits(`${amount}`, tokenDecimals).toString()
        buyAmount = parseUnits(`${price}`, USDT_DECIMALS).toString()
      }

      const balance = await Order.getBalance(walletClient.account.address, sellAsset)
      if (balance < sellAmount*1) {
        Order.showErrorMessage('Insufficient balance')
        reject()
        return 
      }
      
      const limitOrder = limitOrderBuilder.buildLimitOrder({
        makerAssetAddress: sellAsset,
        takerAssetAddress: buyAsset,
        makerAddress: walletClient.account.address,
        makingAmount: sellAmount,
        takingAmount: buyAmount,
      })

      const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(limitOrder)
      const limitOrderHash = hashTypedData(limitOrderTypedData)
      const signature = await walletClient.signTypedData(limitOrderTypedData)

      const post = {
        orderHash: limitOrderHash,
        signature: signature,
        data: limitOrder,
        chainId: chainId,
        orderType: 'active',
        blockchain: network.code,
      }
      const res = await $orders.api.create.token(post)
      if (res) {
        resolve(res)
        return
      }
      reject()
    })
  }

  cancel = () => {
    return new Promise(async (resolve, reject) => {
      const { chainId } = await Order.getWalletData()
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
      Order.showSuccessMessage('Order cancelled successfully')
    })
  }
}

export default { NFT, TOKEN, Order }
