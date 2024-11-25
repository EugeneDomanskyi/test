import { createSlice, createSelector } from '@reduxjs/toolkit'
import { parseCookies } from 'nookies'

import { request } from './index'

export const template = (item) => {
  const blockchainCode = item.blockchainCode ?? parseCookies(null)?.currentChainCode
  if (item?.base_contract_address) {
    return {
      id: item.base_contract_address,
      address: item.base_contract_address,
      quote: item.quote_contract_address,
      marketId: item.id,
      name: `${item.base_symbol}/${item.quote_symbol}`,
      symbol: item.base_symbol,
      quoteSymbol: item.quote_symbol,
      baseDecimals: item.base_decimal,
      quoteDecimals: item.quote_decimal,
      basePrecision: item.base_precision,
      quotePrecision: item.quote_precision,
      blockchain: blockchainCode,
      image: item.base_symbol == 'WETH' ? 'https://tegro.com/images/0x4200000000000000000000000000000000000006.png' : (blockchainCode == 'base' ? `https://storage.googleapis.com/token-assets/assets/${blockchainCode}/${item.base_contract_address}.png` : null),
      volume: item.ticker.quote_volume,
      price: item.ticker.price,
      high: item.ticker.price_high_24h,
      low: item.ticker.price_low_24h,
      trade: {
        buy: item.ticker.ask_low,
        sell: item.ticker.bid_high,
      },
      ticker: {
        value: item.ticker.price_change_24h,
        type: item.ticker.price_change_24h < 0 ? 'minus' : 'plus',
      },
    }
  } else {
    return item
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
      perPage: 40,
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
      state.current = template(payload)
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
  all: (params) => {
    return request(`${params.chain_id}/market/list`, 'GET', {api: "exchange", ...params})
  },
}

export default {
  reducer: tokenSlice.reducer,
  set: tokenSlice.actions,
  get,
  api,
}