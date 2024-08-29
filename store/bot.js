import { createSlice } from '@reduxjs/toolkit'

import { request } from './index'

export const botSlice = createSlice({
  name: '$bot',

  initialState: {
    user: null,
    tab: 'auctions',
    tabHistory: [],
  },

  reducers: {
    user: (state, { payload }) => {
      state.user = payload
    },

    balance: (state, { payload }) => {
      state.user = {
        ...state.user,
        points: payload,
      }
    },

    tab: (state, { payload }) => {
      state.tab = payload
      state.tabHistory = [...state.tabHistory, payload]
    },

    back: (state) => {
      const newHistory = [...state.tabHistory]
      state.tab = newHistory.pop()
      state.tabHistory = newHistory
    },
  },
})

const api = {
  invoice: (params) => {
    return request(`generate-invoice`, 'POST', {api: 'bot', ...params})
  },

  user: () => {
    return request(`telegram/create`, 'GET', {api: 'accounts'})
  },

  transaction: (params) => {
    return request(`telegram/transaction/add`, 'POST', {api: 'accounts', ...params})
  },

  bid: (params) => {
    return request(`place-via-telegram`, 'POST', {api: 'bid', ...params})
  },
}

export default {
  reducer: botSlice.reducer,
  set: botSlice.actions,
  api,
}