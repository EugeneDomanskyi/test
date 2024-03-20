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
    statsLoading: true,
    stats: {
      totalTradingVolume: 0,
      totalOrdersCreated: 0,
      gasSaved: 0,
      totalTradesSettled: 0,
      totalOrdersCancelled: 0,
    },
  },

  reducers: {
    devMode: (state, { payload }) => {
      state.devMode = payload
    },

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

    chains: (state, { payload }) => {
      state.chains = payload.map(item => {
        return {
          id: item.ChainId,
          token: {
            symbol: item.DefaultQuoteTokenSymbol,
            address: item.DefaultQuoteTokenContractAddress.toLowerCase(),
            image: item.Logo || `https://storage.googleapis.com/token-assets/assets/${item?.Name}/${item.DefaultQuoteTokenContractAddress.toLowerCase()}.png`
          },
          contract: {
            exchange: item.ExchangeContract.toLowerCase(),
            settlement: item.SettlementContract.toLowerCase(),
          },
        }
      })
    },
  },
})

export const get = {
  blockchain: createSelector([
    (state) => state.$app.code,
    (state) => state.$app.blockchains,
    (state) => state.$app.chains,
  ], (code, blockchains, chains) => {
    const temp = blockchains.find(item => item.code == code)
    if (temp) {
      const chain = chains.find(item => item.id == temp.id)
      if (chain) {
        const { id, ...info } = chain
        return {
          ...temp,
          info,
        }
      }

      return temp
    }

    return null
  }),

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