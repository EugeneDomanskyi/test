import numeral from 'numeral'
import { formatUnits, encodeFunctionData, parseUnits, hashTypedData } from 'viem'
import { getClient } from '@reservoir0x/reservoir-sdk'
import { getWalletClient, waitForTransaction, sendTransaction, readContract, writeContract, prepareWriteContract, fetchBalance, watchContractEvent } from '@wagmi/core'
import { LimitOrderProtocolFacade, LimitOrderBuilder } from '@1inch/limit-order-protocol-utils'
import { toast } from 'react-toastify'
import * as math from 'mathjs'
import moment from 'moment'

import { CHAINS, INCH_CONTRACTS, INCH_TOKENS, TEGRO_FILL_ORDERS_CONTRACTS } from '@/config'
import $orders from '@/store/orders'
import $nft from '@/store/nft'

//engage dwarf solar solid gesture naive scare accuse pilot scatter chicken ball

const e = {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"TradeFailed","type":"event"}
const TEGRO_ABI = [{"inputs":[{"internalType":"address","name":"_tradingContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"OrderFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"maker","type":"address"},{"indexed":true,"internalType":"address","name":"taker","type":"address"},{"indexed":false,"internalType":"address","name":"makerAsset","type":"address"},{"indexed":false,"internalType":"address","name":"takerAsset","type":"address"},{"indexed":false,"internalType":"uint256","name":"makerAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"takerAmount","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"orderHash","type":"bytes32"}],"name":"TradeSuccessful","type":"event"},{"inputs":[{"components":[{"components":[{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"address","name":"makerAsset","type":"address"},{"internalType":"address","name":"takerAsset","type":"address"},{"internalType":"address","name":"maker","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address","name":"allowedSender","type":"address"},{"internalType":"uint256","name":"makingAmount","type":"uint256"},{"internalType":"uint256","name":"takingAmount","type":"uint256"},{"internalType":"uint256","name":"offsets","type":"uint256"},{"internalType":"bytes","name":"interactions","type":"bytes"}],"internalType":"struct ITradingContract.Order","name":"orderDetails","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"},{"internalType":"bytes","name":"interaction","type":"bytes"},{"internalType":"uint256","name":"makingAmount","type":"uint256"},{"internalType":"uint256","name":"takingAmount","type":"uint256"},{"internalType":"uint256","name":"thresholdAmount","type":"uint256"}],"internalType":"struct MultiOrderRouter.OrderExecution[]","name":"orders","type":"tuple[]"},{"internalType":"uint256","name":"totalTakerAmount","type":"uint256"}],"name":"fillMultipleOrders","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tradingContract","outputs":[{"internalType":"contract ITradingContract","name":"","type":"address"}],"stateMutability":"view","type":"function"}, e]

const subscribes = {}

const queryBuilder = data => {
  const params = new URLSearchParams()
  for (const key in data) {
    if (data[key] != null) {
      if (typeof data[key] == 'object') {
        for (const value of data[key]) {
          params.append(key, value)
        }
      } else {
        params.append(key, data[key])
      }
    }
  }
  return `?${params}`
}

class Order {
  static showSuccessMessage = (message) => {
    toast.success(message)
  }

  static showErrorMessage = message => {
    toast.error(message)
  }

  static writeContract = async (params, callback) => {
    const config = await prepareWriteContract(params).catch(error => {
      console.log('prepare contract error -> ', error)
      return error
    })
    console.log('config contract -> ', config)
    if (config?.mode === 'prepared') {
      if (callback) {
        callback('signing', config)
      }
      const res = await writeContract(config).catch(error => {
        return error
      })
      console.log('write contract res -> ', res)
      if (res?.hash) {
        if (callback) {
          callback('waiting', res)
        }
        const txResult = await waitForTransaction(res)
        return {success: true, data: txResult}
      }
      return {success: false, error: res}
    }
    return {success: false, error: config}
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

  static getDecimals = async (address, chainId) => {
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
      chainId: chainId,
    })
    return res
  }

  static checkAllowance = async (chainId, spenderContract, walletAddress, tokenAddress, amount) => {
    const abiAllowance = {
      constant: true,
      inputs: [{name: '_owner', type: 'address'}, {name: '_spender', type: 'address'}],
      name: 'allowance',
      outputs: [{name: 'remaining', type: 'uint256'}],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }
    const abiApprove = {
      constant: false,
      inputs: [{name: '_spender', type: 'address'}, {name: '_value', type: 'uint256'}],
      name: 'approve',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    }
    const res = await readContract({
      address: tokenAddress,
      abi: [abiAllowance],
      functionName: 'allowance',
      chainId: chainId,
      args: [walletAddress, spenderContract],
    })

    return new Promise(async (resolve, reject) => {
      const decimals = await Order.getDecimals(tokenAddress, chainId)
      const allowanceAmount = formatUnits(res, decimals)
      const isEthereumUsdt = tokenAddress.toLowerCase() === '0xdac17f958d2ee523a2206206994597c13d831ec7'
      if (allowanceAmount*1 < amount*1) {
        if (isEthereumUsdt) {
          await Order.writeContract({
            address: tokenAddress,
            abi: [abiApprove],
            functionName: 'approve',
            chainId: chainId,
            args: [spenderContract, parseUnits('0', decimals)],
          }).catch(error => {
            reject({success: false, message: error.shortMessage})
          })
        }
        const writeContractResult = await Order.writeContract({
          address: tokenAddress,
          abi: [abiApprove],
          functionName: 'approve',
          chainId: chainId,
          args: [spenderContract, parseUnits(Number.MAX_SAFE_INTEGER.toString(), decimals)],
        }).catch(error => {
          reject({success: false, message: error.shortMessage, type: 'balance'})
        })
        if (writeContractResult) {
          resolve({success: true})
        }
        return
      }
      resolve({success: true})
    })
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
        console.log(address)
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
        const balance = await Order.getBalance(walletClient.account.address, blockchain.wrapped.contract)
        if (balance < price*1) {
          Order.showErrorMessage('Insufficient balance')
          reject()
          return 
        }
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
      }).catch((error) => {
        Order.showErrorMessage(error.shortMessage)
        reject(error)
      })
    })
  }
}

class TOKEN extends Order {
  constructor(data) {
    super()
    this.rawData = data.data
    this.id = data.id
    this.side = data.side
    this.baseCurrency = data.baseCurrency
    this.quoteCurrency = data.quoteCurrency
    this.image = data.image
    this.contractAddress = data.contractAddress
    this.quantity = data.quantity
    this.price = data.price
    this.quantityFilled = data.quantityFilled
    this.status = data.status
    this.time = moment(data.createDateTime).format('DD MMM, HH:mm')
  }

  get itemPrice () {
    return numeral(this.price).divide(this.quantity).format('0.0[000]')
  }

  static listenContract = (events, params, callback) => {
    const subsribers = events.map((eventName) => {
      return watchContractEvent({...params, eventName: eventName}, (event) => callback(eventName, event))
    })
    return () => {
      subsribers.forEach(fn => fn())
    }
  }

  static getOpenWithPriceLimitation = async ({chainId, takerAsset, makerAsset, amount, price, side}) => {
    const params = {
      chainId: chainId,
      makerAsset: makerAsset.address,
      takerAsset: takerAsset.address,
      amount: amount,
      price: price,
      side: side,
      makerTokenDecimals: makerAsset.decimals.toString(),
      takerTokenDecimals: takerAsset.decimals.toString(),
    }
    const query = queryBuilder(params)
    const res = await fetch(`https://us-central1-vibrant-waters-399406.cloudfunctions.net/matcher${query}`, {method: 'GET'})
    const json = await res.json()
    // const res = await fetch(`/api/tokens/abilities/${chainId}/${makerAsset}/${takerAsset}/${price}/${amount}/${side}`)
    // const json = await res.json()
    return json
  }

  static fulfill = ({address, makerAsset, takerAsset, amount, price, side}, callback) => {
    return new Promise(async (resolve, reject) => {
      const { chainId, walletClient } = await Order.getWalletData()
      // const network = CHAINS.find(chain => chain.id === chainId)
      let sellAsset = takerAsset
      let buyAsset = makerAsset
      // if (side === 'sell') {
      //   sellAsset = makerAsset
      //   buyAsset = takerAsset
      // }
      const { orders, willSpendAmount, willSpendAmountValue } = await TOKEN.getOpenWithPriceLimitation({
        chainId: chainId,
        takerAsset: sellAsset,
        makerAsset: buyAsset,
        amount: amount,
        side: side,
        price: price,
      })
      if (orders && Array.isArray(orders)) {        
        const balance = await Order.getBalance(walletClient.account.address, sellAsset.address)
        if (willSpendAmount*1 > balance*1) {
          reject({success: false, message: 'Insufficient balance', type: 'balance'})
          return 
        }
        
        const list = orders.map(order => {
          return [
            order.data,
            order.signature,
            '0x',
            math.chain(order.willTakeMakingAmount).divide(side === 'sell' ? 1.000001 : 1).round().done(),
            '0',
            math.chain(order.willSpendTakingAmount).multiply(1.1).round().done(),
          ]
        })

        console.log('params -> ', list, math.chain(willSpendAmountValue).multiply(side === 'buy' ? 1.00001 : 1).round().done())

        let haveEvent = false

        if (subscribes.success) {
          subscribes.success()
        }

        if (subscribes.failed) {
          subscribes.failed()
        }

        subscribes.success = watchContractEvent(
          {eventName: 'TradeSuccessful', address: TEGRO_FILL_ORDERS_CONTRACTS[chainId], abi: TEGRO_ABI},
          (event) => {
            console.log('TradeSuccessful', list.length)
            callback(`contract_TradeSuccessful`, event)
            if (!haveEvent) {
              haveEvent = true
              resolve({success: true})
            }
          }
        )

        subscribes.failed = watchContractEvent(
          {eventName: 'TradeFailed', address: TEGRO_FILL_ORDERS_CONTRACTS[chainId], abi: TEGRO_ABI},
          (event) => {
            callback(`contract_TradeFailed`, event)
            if (!haveEvent) {
              haveEvent = true
              resolve({success: true})
            }
          }
        )

        const result = await Order.writeContract({
          address: TEGRO_FILL_ORDERS_CONTRACTS[chainId],
          abi: TEGRO_ABI,
          functionName: 'fillMultipleOrders',
          args: [list, math.chain(willSpendAmountValue).multiply(side === 'buy' ? 1.00001 : 1).round().done()],
        }, (eventName, eventData) => {
          if (eventName === 'waiting') {
            callback('transaction_completed', {success: true, data: eventData})
          }
        })

        if (result.success) {
          // resolve(result)
          // callback('tran')
          return
        }
        reject({success: false, message: result.error?.shortMessage, type: result.error?.cause?.name})
      }
      reject({success: false, message: 'There is no order to fulfill'})
    })
  }

  static place = ({makerAsset, takerAsset, price, amount, type = 'buy'}, callback) => {
    return new Promise(async (resolve, reject) => {
      const { walletClient, chainId } = await Order.getWalletData()
      const limitOrderBuilder = new LimitOrderBuilder(INCH_CONTRACTS[chainId], chainId, walletClient)
      const network = CHAINS.find(chain => chain.id === chainId)

      const spendAmount = type === 'buy' ? price*amount : amount*1
      const receiveAmount = type === 'buy' ? amount : price*amount
      
      const balance = await Order.getBalance(walletClient.account.address, makerAsset.address)
      
      if (balance < spendAmount) {
        // Order.showErrorMessage('Insufficient balance')
        reject({success: false, message: 'Insufficient balance', type: 'balance'})
        return 
      }

      const limitOrder = limitOrderBuilder.buildLimitOrder({
        makerAssetAddress: makerAsset.address,
        takerAssetAddress: takerAsset.address,
        makerAddress: walletClient.account.address,
        makingAmount: parseUnits(`${spendAmount}`, makerAsset.decimals).toString(),
        takingAmount: parseUnits(`${receiveAmount}`, takerAsset.decimals).toString(),
      })

      const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(limitOrder)
      const limitOrderHash = hashTypedData(limitOrderTypedData)
      const signature = await walletClient.signTypedData(limitOrderTypedData).catch(error => {
        reject({success: false, message: error.shortMessage, type: error.name})
      })

      if (!signature) {
        // reject()
        return
      }
      callback('transaction_completed', {success: true})
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
      reject({success: false})
    })
  }

  cancel = () => {
    return new Promise(async (resolve, reject) => {
      const { chainId } = await Order.getWalletData()
      const contractEncodeABI = (abi, address, methodName, methodParams) => {
        return encodeFunctionData({abi: abi, functionName: methodName, args: methodParams})
      }
      const limitOrderProtocolFacade = new LimitOrderProtocolFacade(INCH_CONTRACTS[chainId], chainId, {contractEncodeABI})
      const callData = limitOrderProtocolFacade.cancelLimitOrder(this.rawData)
      const res = await sendTransaction({
        chainId: chainId,
        to: INCH_CONTRACTS[chainId],
        data: callData,
      }).catch((error) => {
        Order.showErrorMessage(error.shortMessage)
        reject(error)
      })
      if (res) {
        const txResult = await waitForTransaction(res)
        setTimeout(() => {
          Order.showSuccessMessage('Order cancelled successfully')
          resolve(txResult)
        }, 2000)
      }
    })
  }
}

export default { NFT, TOKEN, Order }