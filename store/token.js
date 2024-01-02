import { createSlice, createSelector } from '@reduxjs/toolkit'

import { CHAINS } from '@/config'

import { request } from './index'

export const template = (item) => {
  const blockchain = CHAINS.find(chain => chain.id == item.ChainId)

  return {
    id: item.BaseContractAddress.toLowerCase(),
    address: item.BaseContractAddress.toLowerCase(),
    quote: item.QuoteContractAddress.toLowerCase(),
    marketId: item.ID,
    name: `${item.BaseSymbol}/${item.QuoteSymbol}`,
    symbol: item.BaseSymbol,
    decimals: item.BaseDecimal,
    blockchain: blockchain?.code,
    image: `https://storage.googleapis.com/token-assets/assets/${blockchain?.code}/${item.BaseContractAddress.toLowerCase()}.png`,
    volume: item.ticker.quote_volume,
    price: item.ticker.price,
    high: item.ticker.price_high_24h,
    low: item.ticker.price_low_24h,
    ticker: {
      value: item.ticker.price_change_24h,
      type: item.ticker.price_change_24h < 0 ? 'minus' : 'plus',
    },
  }
}

export const tokenSlice = createSlice({
  name: '$token',

  initialState: {
    all: [],
    searched: [],
    current: {},
    loading: true,
    sort: 'volume:desc',
    search: '',
    searching: false,
    searchEmpty: false,
    pages: {
      history: [1],
      current: 1,
      perPage: 20,
      append: false,
    },
  },

  reducers: {
    loading: (state, { payload }) => {
      state.loading = payload
    },

    all: (state, { payload }) => {
      const tokens = payload.map(token => template(token))
      state.all = state.pages.append ? [...state.all, ...tokens] : tokens
    },

    searched: (state, { payload }) => {
      state.searched = payload.map(token => template(token))
    },

    current: (state, { payload }) => {
      state.current = payload?.BaseContractAddress ? template(payload) : payload
    },

    sort: (state, { payload }) => {
      state.sort = payload
    },

    search: (state, { payload }) => {
      state.search = payload
    },

    searching: (state, { payload }) => {
      state.searching = payload
    },

    searchEmpty: (state, { payload }) => {
      state.searchEmpty = payload
    },

    pages: (state, { payload }) => {
      const current = payload.current ?? state.pages.history.find(item => item == state.pages.current) ?? 1
      const currentIndex = state.pages.history.indexOf(current)
      const history = currentIndex > 0 ? state.pages.history.slice(0, currentIndex + 1) : [1]

      if (payload.next) {
        history.push(payload.next)
      }

      state.pages = {
        current,
        perPage: state.pages.perPage,
        history,
        append: payload?.append ?? false,
      }
    },

    clear: (state) => {
      state.pages = {
        current: 1,
        perPage: state.pages.perPage,
        history: [1],
        append: false,
      }

      state.search = ''
      state.searching = false
      state.searchEmpty = false
    },
  },
})

const get = {
  pages: createSelector([
    (state) => state.$token.pages.history,
    (state) => state.$token.pages.current,
    (state) => state.$token.pages.perPage,
  ], (history, current, perPage) => {
    const currentIndex = history.indexOf(current)
    const prev = history.find((_, index) => (currentIndex > 0) ? index === (currentIndex - 1) : null) ?? null
    const next = history.find((_, index) => (currentIndex >= 0 && currentIndex < history.length - 1) ? index === (currentIndex + 1) : null) ?? null
    return { prev, current, next, perPage }
  }),
}

const api = {
  backend: {
    all: (params) => {
      return request('market/list', 'GET', {api: 'backend', ...params})
    },
  },
}

export default {
  reducer: tokenSlice.reducer,
  set: tokenSlice.actions,
  get,
  api,
}