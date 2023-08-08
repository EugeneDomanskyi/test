import { createSlice } from '@reduxjs/toolkit'
import { setCookie } from 'nookies'
import { CHAINS } from '@/config'

export const appSlice = createSlice({
  name: '$app',

  initialState: {
    socketConnected: false,
    code: null,
    blockchains: CHAINS,
  },

  reducers: {
    code: (state, { payload }) => {
      state.code = payload
      setCookie(null, 'blockchain', payload, {path: '/'})
    },
    socketConnected: (state, { payload }) => {
      state.socketConnected = payload
    },
    isMobile: (state, { payload }) => {
      state.isMobile = payload
    }
  },
})

export const get = {
  blockchain: ({ $app }) => {
    return $app.blockchains.find(item => item.code == $app.code)
  },
  blockchainByCode: (code) => ({ $app }) => {
    return $app.blockchains.find(item => item.code == code)
  }
}

export default {
  reducer: appSlice.reducer,
  set: appSlice.actions,
  get,
}