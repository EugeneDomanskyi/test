import { createSlice } from '@reduxjs/toolkit'

import { request } from './index'

export const botSlice = createSlice({
  name: '$bot',

  initialState: {
    user: null,
    tab: 'auctions',
    tabHistory: [],
    onboard: null,
    outbid: false,
    megaModal: false,
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

    onboard: (state, { payload }) => {
      state.onboard = payload
    },

    outbid: (state, { payload }) => {
      state.outbid = payload
    },

    megaModal: (state, { payload }) => {
      state.megaModal = payload
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
    return request(`telegram/generate-invoice`, 'POST', {api: 'accounts', ...params})
  },

  user: (params) => {
    return request(`telegram/create`, 'POST', {api: 'accounts', ...params})
  },

  transaction: (params) => {
    return request(`telegram/transaction/add`, 'POST', {api: 'accounts', ...params})
  },

  bid: (params) => {
    return request(`place-via-telegram`, 'POST', {api: 'bid', ...params})
  },

  generateWalletHash: (params) => {
    return request(`telegram/hash/generate`, 'GET', {api: 'accounts', ...params})
  },

  assignWalletToUser: (params) => {
    return request(`telegram/assign`, 'POST', {api: 'accounts', ...params})
  },

  unassign: () => {
    return request(`telegram/unassign`, 'DELETE', {api: 'accounts'})
  },

  claim: (params) => {
    return request(`telegram/claim/task`, 'POST', {api: 'accounts', ...params})
  },
}

export default {
  reducer: botSlice.reducer,
  set: botSlice.actions,
  api,
}