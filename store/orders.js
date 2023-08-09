import { createSlice, createSelector } from '@reduxjs/toolkit'
import numeral from 'numeral'
import { formatUnits, encodeFunctionData } from 'viem'
import { getClient } from '@reservoir0x/reservoir-sdk'
import { getWalletClient, waitForTransaction, sendTransaction } from '@wagmi/core'
import { LimitOrderProtocolFacade } from '@1inch/limit-order-protocol-utils'

import { request } from './index'
import { CHAINS, INCH_CONTRACTS } from '@/config'

const Order = {
  NFT: class NFT {
    constructor(data) {
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
      console.log('isAllStepsComplete', isAllStepsComplete, steps)
      if (isAllStepsComplete) {
        resolver()
      }
      // if (isAllStepsComplete && loadingRef.current) {
      //   // toast.success('Order cancelled successfully')
      //   // loadingRef.current = false
      //   // onOrderCancelled()
      //   // trackEvent('Create Order Success', eventPost)
      // }
    }
  },
  TOKEN: class TOKEN {
    constructor(data) {
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
      })
    }
  }
}

export const ordersSlice = createSlice({
  name: '$orders',
  initialState: {
    nfts: [],
    tokens: [],
  },

  reducers: {
    tokens: (state, {payload}) => {
      state.tokens = payload
    },
    nfts: (state, {payload}) => {
      state.nfts = payload
    }
  },
})

const getters = {
  nfts: createSelector([
    state => state.$orders.nfts,
  ], (orders) => {
    return orders.map(order => {
      return new Order.NFT(order)
    })
  }),
  tokens: createSelector([
    state => state.$orders.tokens
  ], (orders) => {
    return orders.map(order => {
      return new Order.TOKEN(order)
    })
  })
}

const api = {
  get: {
    tokens: ({address, ...rest}) => {
      return request(`address/${address}`, 'GET', {api: 'inch', ...rest}).then(res => {
        return res.map(order => ({...order, network: rest.blockchain}))
      })
    },
    nfts: (params) => {
      return Promise.all([
        request('orders/bids/v6', 'GET', params),
        request('orders/asks/v5', 'GET', params),
      ]).then(([bids, asks]) => {
        return [...bids.orders, ...asks.orders]
      })
    },
  }
}

export default {
  reducer: ordersSlice.reducer,
  set: ordersSlice.actions,
  get: getters,
  api: api,
}
