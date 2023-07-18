import { createSlice } from '@reduxjs/toolkit'

import { request } from './index'

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
    loading: true,
  },

  reducers: {
    loading: (state, { payload }) => {
      state.loading = payload
    },

    all: (state, { payload }) => {
      state.all = payload
    },
  },
})

const getters = {
  all: ({$collection, $exchange}) => {
    return {
      collections: sortCollections($collection.all, $exchange.sortType),
      isLoading: $collection.loading
    }
  },
  collection: (key, value) => ({$collection}) => {
    return $collection.all.find(c => c[key] === value)
  }
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