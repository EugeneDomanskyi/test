import { createSlice, createSelector } from '@reduxjs/toolkit'
import { gql } from '@apollo/client'
import numeral from 'numeral'

import { request } from './index'

import tokenAssets from '@/public/files/assets'

function formatNumber(number) {
  if (!number) {
    return ''
  }
  const str = (number*1)?.toFixed(20)
  let lastIndex = -1;

  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] !== '0') {
      lastIndex = i+1;
      break;
    }
  }
  let result = '0.0'
  if (lastIndex !== -1) {
    result = str.slice(0, lastIndex)
  } else {
    result = str
  }
  return isNaN(numeral(result).format('0.0[00000]')) ? result : numeral(result).format('0.0[00000]')
}

export const template = (item, assets) => {
  const currency = 'USDT'

  const overwrite = {
    // ...basicToTemplate(item?.basic),
    // ...infoToTemplate(item?.info),
    // ...fullToTemplate(item?.full),
  }
  const tickerValue = item.price_change_percentage_24h ? Math.abs(item.price_change_percentage_24h ?? 0).toFixed(2) : item.ticker?.value ?? 0

  const ticker = {
    value: tickerValue,
    type: tickerValue >= 0 ? 'plus' : 'minus',
  }

  return {
    id: item?.id,
    // cgId: overwrite?.cgId ?? item?.cgId,
    address: assets?.address ?? item?.id,
    decimals: assets?.decimals ?? item?.decimals,
    image: assets?.image ?? item?.image,
    name: assets?.name ?? item?.name,
    blockchain: assets?.blockchain ?? item?.blockchain,
    symbol: assets?.symbol ?? item?.symbol,
    price: formatNumber(item?.current_price || item?.price || 0),
    high: formatNumber(item?.high_24h ?? item?.high ?? 0),
    low: formatNumber(item?.low_24h ?? item?.low ?? 0),
    currency: currency,
    volume: numeral(item?.volumeUSD ?? item?.volume ?? 0).format('0.[0000]'),
    tvl: numeral(item?.totalValueLockedUSD ?? item?.tvl ?? 0).format('0.[0000]'),
    description: assets?.description ?? item?.description,
    tokenCount: assets?.tokenCount ?? item?.totalSupply ?? 0,
    onSaleCount: assets?.onSaleCount ?? item?.onSaleCount ?? 0,
    discordUrl: null,
    externalUrl: assets?.externalUrl ?? item?.externalUrl,
    twitterUrl: assets?.twitterUrl ?? item?.twitterUrl,
    openseaVerificationStatus: null,
    ticker: ticker,
    isFull: assets?.isFull ?? item?.isFull,
    createdAt: assets?.genesis_date ?? item?.genesis_date,
    marketCap: assets?.marketCap ?? item.marketCap,
  }
}

export const staticTemplate = (item) => {
  const currency = 'USDT'

  return {
    id: item?.id,
    cgId: item?.cgId,
    address: item?.address,
    decimals: item?.decimals,
    image: item?.image,
    name: item?.name,
    blockchain: item?.blockchain,
    symbol: item?.symbol,
    currency: currency,
    description: item?.description,
    tokenCount: item?.tokenCount ?? 0,
    discordUrl: item?.discordUrl,
    externalUrl: item?.externalUrl,
    twitterUrl: item?.twitterUrl,
    openseaVerificationStatus: item?.openseaVerificationStatus === 'verified',
    marketCap: item?.marketCap,
    createdAt: item?.createdAt,
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
      symbol: item.symbol?.toUpperCase(),
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
      genesis_date: item?.genesis_date,
      marketCap: item.market_data?.total_supply * (item.market_data?.current_price?.usd ?? 0),
    }
  }

  return {}
}

export const tokenSlice = createSlice({
  name: '$token',

  initialState: {
    assets: tokenAssets,
    fetching: false,
    all: [],
    searched: [],
    list: [],
    infoList: [],
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
      state.all = payload.map(token => template(token, state.assets[token.id]))
      // if (state.current.id) {
      //   const exist = state.all.find(item => item.id === state.current.id)
      //   if (exist) {
      //     const { price, high, low, volume, tvl, ticker } = exist
      //     state.current = {...state.current, price, high, low, volume, tvl, ticker}
      //   }
      // }
    },

    updatedAll: (state, {payload}) => {
      state.all = state.all.map(token => template({...token, ...payload[token.id]}, state.assets[token.id]))
    },

    searched: (state, { payload }) => {
      state.searched = payload.map(template)
    },

    list: (state, { payload }) => {
      state.list = payload
    },

    infoList: (state, { payload }) => {
      state.infoList = payload
    },

    current: (state, { payload }) => {
      state.current = template(payload, state.assets[payload.id])
    },

    updatedCurrent: (state, {payload}) => {
      state.current = template({...state.current, ...payload}, state.assets[payload.id])
    },

    update: (state, { payload }) => {
      state.all = state.all.map(item => {
        if (item.id.toLowerCase() == payload.id?.toLowerCase()) {
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
  data: createSelector([
    state => state.$token.all,
    state => state.$token.searched,
    state => state.$token.current,
    state => state.$token.loading,
    state => state.$token.sort,
    state => state.$token.search,
    state => state.$token.searching,
    state => state.$token.searchEmpty,
  ], (tokens, searched, current, tokenLoading, sort, search, searching, searchEmpty) => {
    return {
      tokens,
      searched,
      current,
      tokenLoading,
      sort,
      search,
      searching,
      searchEmpty,
    }
  })
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

    top: (params) => {
      return request('search/trending', 'GET', {api: 'coingecko', ...params})
    },
  },
}

const query = {
  tokens: gql`
    query tokens($skip: Int!, $orderBy: String, $orderDirection: String, $searchText: String, $usdt: String) {
      tokens(first: 10, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: { and: [{totalValueLockedUSD_gt: 0}, {derivedETH_gt: 0}, {id_not: $usdt}, {or: [{ name_contains_nocase: $searchText }, { symbol_contains_nocase: $searchText }, { id: $searchText }]}] }) {
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