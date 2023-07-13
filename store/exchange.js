import { createSlice } from '@reduxjs/toolkit'

import { request } from './index'

export const exchangeSlice = createSlice({
  name: '$exchange',

  initialState: {
    orderBook: {
      buy: [],
      sell: [],
    }
  },

  reducers: {
    orderBook: (state, {payload}) => {
      state.orderBook = payload
    }
  },
})

const getters = {
  
}

const api = {
  get: {
    orderBook: (params) => {
      return Promise.all([
        request('orders/depth/v1', 'GET', {side: 'buy', ...params}),
        request('orders/depth/v1', 'GET', {side: 'sell', ...params}),
      ]).then(([buy, sell]) => ({buy: buy.depth.slice(0, 10), sell: sell.depth.slice(0, 10)}))
    },
  },

  bids: (params) => {
    return request('orders/bids/v6', 'GET', params)
  },
}

export default {
  reducer: exchangeSlice.reducer,
  set: exchangeSlice.actions,
  get: getters,
  api: api,
}