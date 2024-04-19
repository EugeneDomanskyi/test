import { createSlice } from '@reduxjs/toolkit'

import { request } from './index'

export const pointSlice = createSlice({
  name: '$point',

  initialState: {
    referral: {
      id: 0,
      points: 0,
      referral_code: '',
      referrals_count: 0,
    },

    stats: {},

    history: [],
    transactions: [],
    quests: [],
    tasks: [],
    leaderboard: [],
  },

  reducers: {
    referral: (state, { payload }) => {
      state.referral = payload
    },

    history: (state, { payload }) => {
      state.history = payload
    },

    transactions: (state, { payload }) => {
      state.transactions = payload
    },

    quests: (state, { payload }) => {
      state.quests = payload
    },

    tasks: (state, { payload }) => {
      state.tasks = payload
    },

    stats: (state, { payload }) => {
      state.stats = payload
    },

    leaderboard: (state, { payload }) => {
      state.leaderboard = payload
    },
  },
})

export const api = {
  register: (params) => {
    return request(`user/create`, 'POST', {api: 'accounts', ...params})
  },

  referral: (wallet) => {
    return request(`user/${wallet}`, 'GET', {api: 'accounts'})
  },

  history: (wallet, params) => {
    return request(`user/${wallet}/referral/transactions`, 'GET', {api: 'accounts', ...params})
  },

  transactions: (wallet, params) => {
    return request(`user/${wallet}/points/transactions`, 'GET', {api: 'accounts', ...params})
  },

  quests: (wallet, params) => {
    return request(`user/${wallet}/quests`, 'GET', {api: 'accounts', ...params})
  },

  questClaim: (wallet, params) => {
    return request(`user/${wallet}/quests/claim`, 'POST', {api: 'accounts', ...params})
  },

  tasks: (wallet, params) => {
    return request(`user/${wallet}/contributor/tasks`, 'GET', {api: 'accounts', ...params})
  },

  taskClaim: (wallet, params) => {
    return request(`user/${wallet}/contributor/tasks/claim`, 'POST', {api: 'accounts', ...params})
  },

  stats: (wallet, params) => {
    return request(`user/${wallet}/daily-stats`, 'GET', {api: 'accounts', ...params})
  },
}

export default {
  reducer: pointSlice.reducer,
  set: pointSlice.actions,
  api,
}