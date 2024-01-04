import { createSlice } from '@reduxjs/toolkit'

import { request } from './index'

export const exchangeSlice = createSlice({
  name: '$exchange',

  initialState: {
    interval: {key: '4h', count: 4, unit: 'hours', seconds: 4*60*60},
    loading: false,
    chart: [],
  },

  reducers: {
    interval: (state, {payload}) => {
      state.interval = payload
    },

    loading: (state, {payload}) => {
      state.loading = payload
    },

    chart: (state, { payload }) => {
      state.chart = payload
    },
  },
})

const api = {
  chart: async (data) => {
    const result = await request(`market/chart`, 'GET', {api: 'backend', ...data})
    if (result) {
      return result.sort((a, b) => a.time - b.time)
    }
    return null
  },
}

export default {
  reducer: exchangeSlice.reducer,
  set: exchangeSlice.actions,
  api,
}