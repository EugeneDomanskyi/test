import { createSlice } from '@reduxjs/toolkit'
import { parseCookies, setCookie } from 'nookies'

export const appSlice = createSlice({
  name: '$app',

  initialState: {
    blockchain: parseCookies().blockchain ?? 'polygon',
    socketConnected: false,
  },

  reducers: {
    blockchain: (state, { payload }) => {
      state.blockchain = payload
      setCookie(null, 'blockchain', payload, {path: '/'})
    },
    socketConnected: (state, { payload }) => {
      state.socketConnected = payload
    }
  },
})

export default {
  reducer: appSlice.reducer,
  set: appSlice.actions,
}