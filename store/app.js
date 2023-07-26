import { createSlice } from '@reduxjs/toolkit'
import { parseCookies, setCookie } from 'nookies'

export const appSlice = createSlice({
  name: '$app',

  initialState: {
    socketConnected: false,
    code: parseCookies().blockchain ?? 'polygon',
    blockchains: [
      {
        id: 1,
        code: 'ethereum',
        name: 'Ethereum',
        currency: 'ETH',
        decimals: 18,
      }, {
        id: 137,
        code: 'polygon',
        name: 'Polygon',
        currency: 'MATIC',
        decimals: 18,
      },
      ...(process.env.NEXT_PUBLIC_APP_ENV == 'local' ? [{
        id: 5,
        code: 'goerli',
        name: 'Goerli',
        currency: 'ETH',
        decimals: 18,
      }] : [])
    ],
  },

  reducers: {
    code: (state, { payload }) => {
      state.code = payload
      setCookie(null, 'blockchain', payload, {path: '/'})
    },
    socketConnected: (state, { payload }) => {
      state.socketConnected = payload
    }
  },
})

export const get = {
  blockchain: ({ $app }) => {
    return $app.blockchains.find(item => item.code == $app.code)
  },
}

export default {
  reducer: appSlice.reducer,
  set: appSlice.actions,
  get,
}