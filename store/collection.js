import { createSlice } from '@reduxjs/toolkit'

import { request } from './index'

const template = (item) => {
  return {
    address: item.id,
    image: item.image,
    name: item.name,
    slug: item.slug,
    price: item.floorAsk?.price?.amount?.decimal ?? 0,
    volume: item.volume['1day'],
    tvl: item.volume['allTime'],
    description: item.description,
    tokenCount: item.tokenCount,
    onSaleCount: item.onSaleCount,
    discordUrl: item.discordUrl,
    externalUrl: item.externalUrl,
    twitterUrl: `https://twitter.com/${item.twitterUsername}`,
    openseaVerificationStatus: item.openseaVerificationStatus,
    ticker: {
      value: (item.floorSaleChange['1day'] && item.floorSaleChange['1day'] != 0 ? Math.abs(1 - item.floorSaleChange['1day']) : 0).toFixed(2),
      type: ((item.floorSaleChange['1day'] >= 1 || item.floorSaleChange['1day'] == 0) ? 'plus' : 'minus'),
    },
  }
}

const sortCollections = (collections, sortType) => {
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
    all: [],
    searched: [],
    loading: true,
    page: 'init',
    pages: {
      history: ['init'],
      current: 'init',
    },
  },

  reducers: {
    loading: (state, { payload }) => {
      state.loading = payload
    },

    all: (state, { payload }) => {
      state.all = payload.map(template)
    },

    searched: (state, { payload }) => {
      state.searched = payload.map(template)
    },

    add: (state, { payload }) => {
      if ( ! state.all.find(item => item.address == payload.address)) {
        state.all = [
          ...state.all,
          payload
        ]
      }
    },

    page: (state, { payload }) => {
      state.page = payload
    },

    pages: (state, { payload }) => {
      const current = state.pages.history.find(item => item == state.page) ?? 'init'
      const currentIndex = state.pages.history.indexOf(state.page)
      const history = currentIndex > 0 ? state.pages.history.slice(0, currentIndex + 1) : ['init']
      history.push(payload)

      state.pages = {
        current,
        history,
      }
    },

    pagesClear: (state) => {
      state.page = 'init'
      state.pages = {
        current: 'init',
        history: ['init'],
      }
    },
  },
})

const getters = {
  all: ({$collection, $exchange}) => {
    return {
      collections: sortCollections($collection.all, $exchange.sortType),
      searched: sortCollections($collection.searched, $exchange.sortType),
      isLoading: $collection.loading
    }
  },
  
  collection: (key, value) => ({$collection}) => {
    let collection = $collection.all.find(c => c[key] === value)
    if (!collection) {
      collection = $collection.searched.find(c => c[key] === value)
    }
    return collection
  },

  pages: ({$collection}) => {
    const currentIndex = $collection.pages.history.indexOf($collection.pages.current)
    const prev = $collection.pages.history.find((_, index) => (currentIndex > 0) ? index === (currentIndex - 1) : null) ?? null
    const next = $collection.pages.history.find((_, index) => (currentIndex >= 0 && currentIndex < $collection.pages.history.length - 1) ? index === (currentIndex + 1) : null) ?? null
    return { prev, next }
  },
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