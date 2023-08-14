import { createSlice, createSelector } from '@reduxjs/toolkit'
import { formatUnits } from 'viem'
import numeral from 'numeral'
import moment from 'moment'

import { request } from './index'
import Order from '@/libs/structs/Order'
import { INCH_TOKENS, CHAINS } from '@/config'

export const ordersSlice = createSlice({
  name: '$orders',
  initialState: {
    nfts: [],
    tokens: [],
    orderBooks: {
      nfts: {
        buy: [],
        sell: [],
      },
      tokens: {
        buy: [],
        sell: [],
      },
    },
    trades: {
      nfts: [],
      tokens: [],
    }
  },

  reducers: {
    tokens: (state, {payload}) => {
      state.tokens = payload
    },
    nfts: (state, {payload}) => {
      state.nfts = payload
    },
    orderBook: (state, {payload}) => {
      state.orderBooks[payload.type] = payload.data
    },
    trades: (state, {payload}) => {
      state.trades[payload.type] = payload.data
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
  }),
  orderBook: (type) => createSelector([
    state => state.$orders.orderBooks[type]
  ], (orderBook) => {
    return {
      buy: orderBook.buy.slice(0, 10),
      sell: orderBook.sell.slice(0, 10),
    }
  }),
  recentTrades: (type, limit) => createSelector([
    state => state.$orders.trades[type]
  ], (trades) => {
    return trades.slice(0, limit).map(sale => {
      return {
        ...sale,
        priceFormatted: sale.priceFormatted ?? sale.price.amount.decimal,
      }
    })
  }),
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
  },
  create: {
    token: (params) => {
      return request(`limit-order`, 'POST', {api: 'inch', ...params})
    }
  }
}

api.get.nfts.orderBook = (params) => {
  return Promise.all([
    request('orders/depth/v1', 'GET', {side: 'buy', ...params}),
    request('orders/depth/v1', 'GET', {side: 'sell', ...params}),
  ]).then(([buy, sell]) => {
    return {buy: buy ? buy.depth : [], sell: sell ? sell.depth : []}
  })
}

api.get.tokens.orderBook = ({address, ...rest}) => {
  return Promise.all([
    request('all', 'GET', {api: 'inch', takerAsset: address, ...rest}),
    request('all', 'GET', {api: 'inch', makerAsset: address, ...rest}),
  ]).then(([buy, sell]) => {
    return {buy: buy, sell: sell}
  })
}

api.get.tokens.trades = ({address, blockchain, ...rest}) => {
  const network = CHAINS.find(chain => chain.code === blockchain)
  return Promise.all([
    request('all', 'GET', {api: 'inch', takerAsset: address, makerAsset: network.usdtContract, blockchain, ...rest}),
    request('all', 'GET', {api: 'inch', takerAsset: address, makerAsset: network.usdtContract, page: 2, blockchain, ...rest}),
    request('all', 'GET', {api: 'inch', takerAsset: address, makerAsset: network.usdtContract, page: 3, blockchain, ...rest}),
    request('all', 'GET', {api: 'inch', makerAsset: address, takerAsset: network.usdtContract, blockchain, ...rest}),
    request('all', 'GET', {api: 'inch', makerAsset: address, takerAsset: network.usdtContract, page: 2, blockchain, ...rest}),
    request('all', 'GET', {api: 'inch', makerAsset: address, takerAsset: network.usdtContract, page: 3, blockchain, ...rest}),
  ]).then(([sell1, sell2, sell3, buy1, buy2, buy3]) => {
    const addSide = (list) => list.map(item => {
      const makerAsset = INCH_TOKENS[item.data.makerAsset]
      const takerAsset = INCH_TOKENS[item.data.takerAsset]

      if (!makerAsset || !takerAsset) {
        return {}
      }
      
      const makingAssetFormatted = formatUnits(item.data.makingAmount, makerAsset.decimals)
      const takingAssetFormatted = formatUnits(item.data.takingAmount, takerAsset.decimals)

      const side = makerAsset.symbol === 'USDT' ? 'buy' : 'sell'

      const price = side === 'buy' ? makingAssetFormatted : takingAssetFormatted
      const amount = side === 'sell' ? makingAssetFormatted : takingAssetFormatted
      const timestamp = moment(item.createDateTime).unix()
      return {
        ...item,
        side: side,
        priceFormatted: numeral(price / amount).format('0.0[0000000]'),//numeral(price).divide(amount).format('0.0[000000]'),
        amount: numeral(amount).format('0.[0000]'),
        timestamp: timestamp,
      }
    })
    return [
      addSide(buy1, 'buy'),
      addSide(buy2, 'buy'),
      addSide(buy3, 'buy'),
      addSide(sell1, 'sell'),
      addSide(sell2, 'sell'),
      addSide(sell3, 'sell'),
      
    ].flat().filter(order => {
      return order.orderInvalidReason === 'order filled' && order.priceFormatted !== 'NaN'
    })
  })
}

export default {
  reducer: ordersSlice.reducer,
  set: ordersSlice.actions,
  get: getters,
  api: api,
}
