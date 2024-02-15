import { createSlice, createSelector } from '@reduxjs/toolkit'
import {tokenSlice} from "@/store/token";
import {request} from "@/store/index";

export const tournamentSlice = createSlice({
  name: "$tournament",

  initialState: {
    data: null,
    current: null,
    loading: true,
  },

  reducers: {
    current: (state, { payload }) => {
      state.current = payload
    },

    loading: (state, { payload }) => {
      state.loading = payload
    },
  }
})

const api = {
  get: (alias) => {
    return request(`tournament/${alias}`)
  },
  create: (post) => {
    return request(`tournament/create`, 'POST', post)
  },
  current: () => {
    return request(`tournament/current`)
  },
  leaderboard: (alias) => {
    return request(`tournament/${alias}/leaderboard`)
  },
  walletResult: (alias, wallet) => {
    return request(`tournament/${alias}/leaderboard/${wallet}`) // 0x113128f65d830b5295cef847597f4655f3d8e47c
  },
}

export default {
  reducer: tournamentSlice.reducer,
  set: tournamentSlice.actions,
  api,
}