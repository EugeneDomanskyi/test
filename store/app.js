import { createSelector, createSlice } from '@reduxjs/toolkit'
import { setCookie } from 'nookies'
import { gql } from '@apollo/client'
import { CHAINS } from '@/config'

export const appSlice = createSlice({
  name: '$app',

  initialState: {
    socketConnected: false,
    code: null,
    blockchains: CHAINS,
    marketInfo: [],
    size: {
      isMobile: false,
      windowWidth: null,
      windowHeight: null,
    }
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
    marketInfo: (state, { payload }) => {
      state.marketInfo = payload
    }
  },
})

export const get = {
  blockchain: ({ $app }) => {
    return $app.blockchains.find(item => item.code == $app.code)
  },

  blockchainByCode: (code) => ({ $app }) => {
    return $app.blockchains.find(item => item.code == code)
  },

  pageBlockchains: (page) => createSelector([
    (state) => state.$app.blockchains,
  ], (blockchains) => {
    return blockchains.filter(item => item.pages.some(el => el == page))
  }),
}

const query = {
  totalVolume: gql`
    query totalVolume {
      totalVolume(id: "usdt_volume") {
        volume
      }
    }
  `,
}

export default {
  reducer: appSlice.reducer,
  set: appSlice.actions,
  query,
  get,
}