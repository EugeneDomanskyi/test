import { createSlice, createSelector } from '@reduxjs/toolkit'
import { request } from './index'
import Order from '@/libs/structs/Order'

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

export default {
  reducer: ordersSlice.reducer,
  set: ordersSlice.actions,
  get: getters,
  api: api,
}
