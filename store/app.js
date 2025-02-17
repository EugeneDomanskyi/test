import { createSelector, createSlice } from '@reduxjs/toolkit'
import { setCookie } from 'nookies'

import { request } from './index'

export const appSlice = createSlice({
  name: '$app',

  initialState: {
    socketConnected: false,
    code: null,
    chains: [],
    size: {
      isMobile: null,
      windowWidth: null,
      windowHeight: null,
    },
    devMode: false,
    isApp: false,
    platform: null,
    initWallet: null,
    appTheme: null,
    statsLoading: true,
    stats: {
      totalTradingVolume: 0,
      totalOrdersCreated: 0,
      gasSaved: 0,
      totalTradesSettled: 0,
      totalOrdersCancelled: 0,
    },
    wpk: null,
    // wpk: '0x2b6b11c2b1034a3fd897cf5b681bb5d1d356381346adfac929bceacf0998a220',
    connection: { loading: true, connected: false },
    wallet: null,
    appConnected: false,
    stickyBannerVisible: false,
    userRegistered: false,
    user: null
  },

  reducers: {
    devMode: (state, { payload }) => {
      state.devMode = payload
    },
    
    appTheme: (state, { payload }) => {
      state.appTheme = payload
    },

    code: (state, { payload }) => {
      state.code = payload
      setCookie(null, 'currentChainCode', payload, {path: '/'})
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

    wpk: (state, { payload }) => {
      state.wpk = payload
    },

    connection: (state, { payload }) => {
      state.connection = payload
    },

    wallet: (state, { payload }) => {
      state.wallet = payload
    },

    appConnected: (state, { payload }) => {
      state.appConnected = payload
    },

    stickyBannerVisible: (state, { payload }) => {
      state.stickyBannerVisible = payload
    },

    userRegistered: (state, { payload }) => {
      state.userRegistered = payload
    },

    user: (state, { payload }) => {
      state.user = payload
    },
  },
})

export const get = {
  blockchain: createSelector([
    (state) => state.$app.code,
    (state) => state.$app.chains,
  ], (code, chains) => {
    return chains.find(item => item.code == code)
  }),
}

export const api = {
  vid: (params) => {
    return request(`https://us-central1-vibrant-waters-399406.cloudfunctions.net/connect-wallet-vid`, 'POST', { api: 'remote', ...params })
  },

  volume: (params) => {
    return request(`https://us-central1-vibrant-waters-399406.cloudfunctions.net/magic_square_trade_volume_check`, 'POST', { api: 'remote', ...params })
  },

  chains: () => {
    return request(`chain/list`, 'GET', {api: 'exchange'})
  },

  payram: (params) => {
    return request(`referral/referrers/authenticate`, 'POST', {api: 'payram', ...params})
  },
}

export default {
  reducer: appSlice.reducer,
  set: appSlice.actions,
  api,
  get,
}