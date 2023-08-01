import { createSlice } from '@reduxjs/toolkit'
import { setCookie } from 'nookies'

export const appSlice = createSlice({
  name: '$app',

  initialState: {
    socketConnected: false,
    code: null,
    blockchains: [
      {
        id: 1,
        code: 'ethereum',
        name: 'Ethereum',
        currency: 'ETH',
        decimals: 18,
        wrapped: {
          contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          name: 'Wrapped Ether',
          shortName: 'WETH',
        },
      }, {
        id: 137,
        code: 'polygon',
        name: 'Polygon',
        currency: 'MATIC',
        decimals: 18,
        wrapped: {
          contract: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
          name: 'Wrapped Matic',
          shortName: 'WMATIC',
        },
      },
      ...(process.env.NEXT_PUBLIC_APP_ENV == 'local' ? [{
        id: 5,
        code: 'goerli',
        name: 'Goerli',
        currency: 'ETH',
        decimals: 18,
        wrapped: {
          contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          name: 'Wrapped Ether',
          shortName: 'WETH',
        },
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