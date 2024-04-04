import { createSlice, createSelector } from '@reduxjs/toolkit'
import {tokenSlice} from "@/store/token";
import {request} from "@/store/index";

export const tournamentSlice = createSlice({
  name: "$tournament",

  initialState: {
    all: [],
    current: null,
    loading: true,
  },

  reducers: {
    all: (state, { payload }) => {
      state.all = payload
    },

    current: (state, { payload }) => {
      state.current = payload
    },

    loading: (state, { payload }) => {
      state.loading = payload
    },
  }
})

const api = {
  all: () => {
    return request(`tournament/list`, 'GET', {api: 'exchange'})
  },

  get: (alias) => {
    return request(`tournament/${alias}`, 'GET', {api: 'exchange'})
  },

  create: (post) => {
    return request(`tournament/create`, 'POST', {api: 'exchange', ...post})
  },

  current: () => {
    return request(`tournament/current`, 'GET', {api: 'exchange'})
  },

  leaderboard: (alias) => {
    return request(`tournament/${alias}/leaderboard`, 'GET', {api: 'exchange'})
  },

  walletResult: (alias, wallet) => {
    return request(`tournament/${alias}/leaderboard/${wallet}`, 'GET', {api: 'exchange'}) // 0x113128f65d830b5295cef847597f4655f3d8e47c
  },
}

export default {
  reducer: tournamentSlice.reducer,
  set: tournamentSlice.actions,
  api,
}