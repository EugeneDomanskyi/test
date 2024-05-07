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
  walletCount: () => {
    return request('https://us-central1-vibrant-waters-399406.cloudfunctions.net/fetch_connected_wallet_count', 'GET', {api: 'remote'}) 
  },

  vid: (params) => {
    return request(`https://us-central1-vibrant-waters-399406.cloudfunctions.net/connect-wallet-vid`, 'POST', { api: 'remote', ...params })
  },

  volume: (params) => {
    return request(`https://us-central1-vibrant-waters-399406.cloudfunctions.net/magic_square_trade_volume_check`, 'POST', { api: 'remote', ...params })
  },

  chains: () => {
    return request(`chain/list`, 'GET', {api: 'exchange'})
  },

  totalTradingVolume: () => {
    return request(`https://mb.betora.vip/api/public/dashboard/b41548ce-79fc-42e2-a074-7027087e1cbb/dashcard/5/card/6`, 'GET', {api: 'remote'})
  },

  sevenDaysTradingVolume: () => {
    return request(`https://mb.betora.vip/api/public/dashboard/b41548ce-79fc-42e2-a074-7027087e1cbb/dashcard/27/card/33`, 'GET', {api: 'remote'})
  },

  totalOrdersCreated: () => {
    return request(`https://mb.betora.vip/api/public/dashboard/b41548ce-79fc-42e2-a074-7027087e1cbb/dashcard/25/card/32`, 'GET', {api: 'remote'})
  },

  gasSaved: () => {
    return request(`https://mb.betora.vip/api/public/dashboard/b41548ce-79fc-42e2-a074-7027087e1cbb/dashcard/9/card/11`, 'GET', {api: 'remote'})
  },

  totalTradesSettled: () => {
    return request(`https://mb.betora.vip/api/public/dashboard/b41548ce-79fc-42e2-a074-7027087e1cbb/dashcard/8/card/8`, 'GET', {api: 'remote'})
  },

  totalOrdersCancelled: () => {
    return request(`https://mb.betora.vip/api/public/dashboard/b41548ce-79fc-42e2-a074-7027087e1cbb/dashcard/6/card/10`, 'GET', {api: 'remote'})
  },

  stats: () => {
    return request(`api/stats`, 'GET', {api: 'local'})
  },
}

export default {
  reducer: appSlice.reducer,
  set: appSlice.actions,
  api,
  get,
}