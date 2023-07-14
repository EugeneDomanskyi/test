import { createSlice } from '@reduxjs/toolkit'
import { parseCookies, setCookie } from 'nookies'

export const appSlice = createSlice({
  name: '$app',

  initialState: {
    blockchain: parseCookies().blockchain ?? 'polygon',
  },

  reducers: {
    blockchain: (state, { payload }) => {
      state.blockchain = payload
      setCookie(null, 'blockchain', payload, {path: '/'})
    },
  },
})

export default {
  reducer: appSlice.reducer,
  set: appSlice.actions,
}