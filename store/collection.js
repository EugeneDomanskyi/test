import { createSlice, createSelector } from '@reduxjs/toolkit'

import { request } from './index'

export const template = (item) => {
  return {
    id: item.id,
    address: item.id,
    image: item.image,
    name: item.name,
    blockchain: item.blockchain,
    slug: item.slug,
    price: item.floorAsk?.price?.amount?.native ?? 0,
    currency: item.currency,
    volume: item.volume['1day'],
    tvl: item.volume['allTime'],
    marketCap: item.tokenCount * (item.floorAsk?.price?.amount?.native ?? 0),
    description: item.description,
    tokenCount: item.tokenCount,
    onSaleCount: item.onSaleCount,
    discordUrl: item.discordUrl,
    externalUrl: item.externalUrl,
    twitterUrl: item.twitterUsername ? `https://twitter.com/${item.twitterUsername}` : null,
    openseaVerificationStatus: item.openseaVerificationStatus,
    ticker: {
      value: (item.floorSaleChange['1day'] && item.floorSaleChange['1day'] != 0 ? Math.abs(1 - item.floorSaleChange['1day']) : 0).toFixed(2),
      type: ((item.floorSaleChange['1day'] >= 1 || item.floorSaleChange['1day'] == 0) ? 'plus' : 'minus'),
    },
    banner: item.banner,
    sampleImages: item.sampleImages,
    createdAt: item.createdAt
  }
}

export const sortCollections = (collections, sortType) => {
  const [sortField, sortVerctor] = sortType.split(':')
  const sortedMarkets = [...collections].sort((a, b) => {
    switch (sortField) {
      case 'NAME':
        return a.name.localeCompare(b.name)
      case 'VOLUME':
        return a.volume - b.volume
      case 'PRICE':
        return a.price - b.price
    }
  })

  if (sortVerctor === 'DESC') {
    return sortedMarkets.reverse()
  }

  return sortedMarkets
}

export const collectionSlice = createSlice({
  name: '$collection',

  initialState: {
    fetching: false,
    all: [],
    searched: [],
    current: {},
    loading: true,
    sort: 'VOLUME:DESC',
    search: '',
    searching: false,
    searchEmpty: false,
    pages: {
      history: ['init'],
      current: 'init',
    },
    marketInfo: {},
  },

  reducers: {
    fetching: (state, { payload }) => {
      state.fetching = payload
    },

    loading: (state, { payload }) => {
      state.loading = payload
    },

    all: (state, { payload }) => {
      state.all = payload.map(template)
    },

    searched: (state, { payload }) => {
      state.searched = payload.map(template)
    },

    current: (state, { payload }) => {
      state.current = payload
    },

    currentMarketSeoInfo: (state, { payload }) => {
      state.marketInfo = payload
    },
    
    updateItem: (state, { payload }) => {
      const newAll = state.all.map(item => {
        return item.id.toLowerCase() == payload.id.toLowerCase() ? template(payload) : item
      })
      state.all = newAll

      const newSearched = state.searched.map(item => {
        return item.id.toLowerCase() == payload.id.toLowerCase() ? template(payload) : item
      })
      state.searched = newSearched

      if (state.current.id.toLowerCase() == payload.id.toLowerCase()) {
        state.current = template(payload)
      }
    },

    update: (state, { payload }) => {
      state[payload.key] = payload.value
    },

    add: (state, { payload }) => {
      if ( ! state.all.find(item => item.address == payload.address)) {
        state.all = [
          ...state.all,
          payload
        ]
      }
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
      const current = payload.current ?? state.pages.history.find(item => item == state.pages.current) ?? 'init'
      const currentIndex = state.pages.history.indexOf(current)
      const history = currentIndex > 0 ? state.pages.history.slice(0, currentIndex + 1) : ['init']

      if (payload.next) {
        history.push(payload.next)
      }

      state.pages = {
        current,
        history,
      }
    },

    clear: (state) => {
      state.pages = {
        current: 'init',
        history: ['init'],
      }

      state.search = ''
      state.searching = false
      state.searchEmpty = false
    },
  },
})

const getters = {
  pages: createSelector([
    (state) => state.$collection.pages.history,
    (state) => state.$collection.pages.current,
  ], (history, current) => {
    const currentIndex = history.indexOf(current)
    const prev = history.find((_, index) => (currentIndex > 0) ? index === (currentIndex - 1) : null) ?? null
    const next = history.find((_, index) => (currentIndex >= 0 && currentIndex < history.length - 1) ? index === (currentIndex + 1) : null) ?? null

    return { prev, current, next }
  }),
}

const api = {
  all: (params) => {
    return request('collections/v6', 'GET', params)
  },

  top: (params) => {
    return request('collections/top-selling/v1', 'GET', params)
  },
}

export default {
  reducer: collectionSlice.reducer,
  set: collectionSlice.actions,
  get: getters,
  api,
}