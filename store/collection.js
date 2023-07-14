import { createSlice } from '@reduxjs/toolkit'

import { request } from './index'

export const collectionSlice = createSlice({
  name: '$collection',

  initialState: {
    all: [],
    loading: true,
  },

  reducers: {
    loading: (state, { payload }) => {
      state.loading = payload
    },

    all: (state, { payload }) => {
      state.all = payload
    },
  },
})

const api = {
  all: (params) => {
    return request('collections/v6', 'GET', params)
  },

  top: (params) => {
    return request('collections/top-selling/v1', 'GET', params)
  },
}

export default {
  reducer: collectionSlice.reducer,
  set: collectionSlice.actions,
  api,
}