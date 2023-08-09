import { createSlice, createSelector } from '@reduxjs/toolkit'
import { request } from './index'
import Order from '@/libs/structs/Order'

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
