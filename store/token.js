import { createSlice, createSelector } from '@reduxjs/toolkit'
import { gql } from '@apollo/client'
import numeral from 'numeral'

import { request } from './index'

export const template = (item) => {
  const currency = 'USD'

  const overwrite = {
    ...basicToTemplate(item?.basic),
    ...infoToTemplate(item?.info),
    ...fullToTemplate(item?.full),
  }

  return {
    id: overwrite?.id ?? item?.id,
    cgId: overwrite?.cgId ?? item?.cgId,
    address: overwrite?.address ?? item?.address,
    decimals: overwrite?.decimals ?? item?.decimals,
    image: overwrite?.image ?? item?.image,
    name: overwrite?.name ?? item?.name,
    blockchain: overwrite?.blockchain ?? item?.blockchain,
    symbol: overwrite?.symbol ?? item?.symbol,
    price: numeral(overwrite?.price ?? item?.price ?? 0).format('0.[0000]'),
    high: numeral(overwrite?.high ?? item?.high ?? 0).format('0.[0000]'),
    low: numeral(overwrite?.low ?? item?.low ?? 0).format('0.[0000]'),
    currency: currency,
    volume: numeral(overwrite?.volume ?? item?.volume ?? 0).format('0.[0000]'),
    tvl: numeral(overwrite?.tvl ?? item?.tvl ?? 0).format('0.[0000]'),
    description: overwrite?.description ?? item?.description,
    tokenCount: overwrite?.tokenCount ?? item?.tokenCount ?? 0,
    onSaleCount: overwrite?.onSaleCount ?? item?.onSaleCount ?? 0,
    discordUrl: null,
    externalUrl: overwrite?.externalUrl ?? item?.externalUrl,
    twitterUrl: overwrite?.twitterUrl ?? item?.twitterUrl,
    openseaVerificationStatus: null,
    ticker: {
      value: overwrite?.ticker?.value ?? item?.ticker?.value ?? 0,
      type: overwrite?.ticker?.type ?? item?.ticker?.type,
    },
    isFull: overwrite?.isFull ?? item?.isFull,
  }
}

const basicToTemplate = (item) => {
  if (item) {
    return {
      id: item.id,
      address: item.id,
      name: item.name,
      decimals: item.decimals,
      symbol: item.symbol.toUpperCase(),
      tokenCount: item.totalSupply,
      volume: item.volumeUSD,
      tvl: item.totalValueLockedUSD,
    }
  }

  return {}
}

const infoToTemplate = (item) => {
  if (item) {
    return {
      cgId: item.id,
      symbol: item.symbol.toUpperCase(),
      image: item.image,
      price: item.current_price,
      high: item.high_24h,
      low: item.low_24h,
      volume: item.total_volume,
      tokenCount: item.total_supply,
      onSaleCount: item.circulating_supply,
      ticker: {
        value: Math.abs(item.price_change_percentage_24h ?? 0).toFixed(2),
        type: ((item.price_change_percentage_24h ?? 0) >= 0) ? 'plus' : 'minus',
      },
    }
  }

  return {}
}

const fullToTemplate = (item) => {
  if (item) {
    return {
      isFull: true,
      cgId: item.id,
      symbol: item.symbol.toUpperCase(),
      image: item.image.large,
      price: item.market_data?.current_price?.usd,
      high: item.market_data?.high_24h?.usd,
      low: item.market_data?.low_24h?.usd,
      volume: item.market_data?.total_volume?.usd,
      tvl: item.market_data?.total_value_locked,
      description: item.description?.en,
      tokenCount: item.market_data?.total_supply,
      onSaleCount: item.market_data?.circulating_supply,
      externalUrl: item.links?.homepage[0],
      twitterUrl: item.links?.twitter_screen_name ? `https://twitter.com/${item.links?.twitter_screen_name}` : null,
      ticker: {
        value: Math.abs(item.market_data?.price_change_percentage_24h ?? 0).toFixed(2),
        type: ((item.market_data?.price_change_percentage_24h ?? 0) >= 0) ? 'plus' : 'minus',
      },
    }
  }

  return {}
}

export const tokenSlice = createSlice({
  name: '$token',

  initialState: {
    fetching: false,
    all: [],
    searched: [],
    list: [],
    current: {},
    loading: true,
    sort: 'VOLUME:DESC',
    search: '',
    searching: false,
    searchEmpty: false,
    pages: {
      history: [1],
      current: 1,
    },
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

    list: (state, { payload }) => {
      state.list = payload
    },

    current: (state, { payload }) => {
      state.current = payload
    },

    update: (state, { payload }) => {
      state.all = state.all.map(item => {
        if (item.id.toLowerCase() == payload.id.toLowerCase()) {
          return payload
        } else {
          return item
        }
      })
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
        history,
      }
    },

    clear: (state) => {
      state.pages = {
        current: 1,
        history: [1],
      }

      state.search = ''
      state.searching = false
      state.searchEmpty = false
    },
  },
})

const getters = {
  pages: createSelector([
    (state) => state.$token.pages.history,
    (state) => state.$token.pages.current,
  ], (history, current) => {
    const currentIndex = history.indexOf(current)
    const prev = history.find((_, index) => (currentIndex > 0) ? index === (currentIndex - 1) : null) ?? null
    const next = history.find((_, index) => (currentIndex >= 0 && currentIndex < history.length - 1) ? index === (currentIndex + 1) : null) ?? null
    return { prev, current, next }
  }),
}

const api = {
  coingecko: {
    list: (params) => {
      return request('coins/list', 'GET', {api: 'coingecko', ...params})
    },

    local: () => {
      return request('files/coingecko-tokens.json', 'GET', {api: 'local'})
    },

    info: (params) => {
      return request('coins/markets', 'GET', {api: 'coingecko', ...params})
    },

    full: ({platform, address, ...params}) => {
      return request(`coins/${platform}/contract/${address}`, 'GET', {api: 'coingecko', ...params})
    },
  },
}

const query = {
  tokens: gql`
    query tokens($skip: Int!, $orderBy: String, $orderDirection: String, $searchText: String) {
      tokens(first: 10, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: { and: [{totalValueLockedUSD_gt: 0}, {derivedETH_gt: 0}, {or: [{ name_contains_nocase: $searchText }, { symbol_contains_nocase: $searchText }, { id: $searchText }]}] }) {
        id
        name
        symbol
        decimals
        totalSupply
        volumeUSD
        totalValueLockedUSD
      }
    }
  `,

  token: gql`
    query token($id: String) {
      token(id: $id) {
        id
        name
        symbol
        decimals
        totalSupply
        volumeUSD
        totalValueLockedUSD
      }
    }
  `,
}

export default {
  reducer: tokenSlice.reducer,
  set: tokenSlice.actions,
  get: getters,
  api,
  query,
}