import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: '$app',

  initialState: {
    tokens: [],
    loadingTokens: true,
  },

  reducers: {
    appKey: (state, {payload}) => {
      state[payload.key] = payload.data
    },
    tokens: (state, {payload}) => {
      state.tokens = payload
      state.loadingTokens = false
    }
  },
})

const getters = {
  token: (key, value) => ({$app}) => {
    return $app.tokens.find(token => token[key] == value)
  }
}

export default {
  reducer: appSlice.reducer,
  set: appSlice.actions,
  get: getters,
}