import { createSlice } from '@reduxjs/toolkit'

import { request } from './index'

export const nftSlice = createSlice({
  name: '$nft',

  initialState: {
    all: [],
    prices: [],
    loading: true,
  },

  reducers: {
    loading: (state, { payload }) => {
      state.loading = payload
    },

    all: (state, { payload }) => {
      state.all = payload
    },

    prices: (state, { payload }) => {
      state.prices = payload
    },
  },
})

const api = {
  all: (params) => {
    return request('tokens/v6', 'GET', params)
  },

  prices: (params) => {
    return request('tokens/floor/v1', 'GET', params)
  },

  users: ({user, ...params}) => {
    return request(`users/${user}/tokens/v7`, 'GET', params)
  },
}

export default {
  reducer: nftSlice.reducer,
  set: nftSlice.actions,
  api,
}