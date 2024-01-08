import { createSelector, createSlice } from '@reduxjs/toolkit'
import { setCookie } from 'nookies'

import { CHAINS } from '@/config'

import { request } from './index'

export const appSlice = createSlice({
  name: '$app',

  initialState: {
    socketConnected: false,
    code: null,
    blockchains: CHAINS,
    size: {
      isMobile: null,
      windowWidth: null,
      windowHeight: null,
    },
    isApp: false,
  },

  reducers: {
    code: (state, { payload }) => {
      state.code = payload
      setCookie(null, 'blockchain', payload, {path: '/'})
    },

    socketConnected: (state, { payload }) => {
      state.socketConnected = payload
    },

    size: (state, { payload }) => {
      state.size = {
        isMobile: payload?.isMobile ?? (payload?.width ? payload.width <= 768 : false),
        windowWidth: payload?.width,
        windowHeight: payload?.height,
      }
    },
  },
})

export const get = {
  blockchain: ({ $app }) => {
    return $app.blockchains.find(item => item.code == $app.code)
  },

  pageBlockchains: (page) => createSelector([
    (state) => state.$app.blockchains,
  ], (blockchains) => {
    return blockchains.filter(item => item.pages.some(el => el == page))
  }),
}

export const api = {
  walletCount: () => {
    return request('https://us-central1-vibrant-waters-399406.cloudfunctions.net/fetch_connected_wallet_count', 'GET', {api: 'remote'}) 
  },

  vid: (params) => {
    return request(`https://us-central1-vibrant-waters-399406.cloudfunctions.net/connect-wallet-vid`, 'POST', { api: 'remote', ...params })
  },

  volume: (params) => {
    return request(`https://us-central1-vibrant-waters-399406.cloudfunctions.net/magic_square_trade_volume_check`, 'POST', { api: 'remote', ...params })
  },
}

export default {
  reducer: appSlice.reducer,
  set: appSlice.actions,
  api,
  get,
}