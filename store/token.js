import { createSlice, createSelector } from '@reduxjs/toolkit'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

import { request } from './index'

export const template = (item) => {
  const currency = 'usd'

  if (item?.full) {
    item.info = convertFullToInfo(item.full)
  }

  return {
    id: item?.id,
    cgId: item?.cgId ?? item?.info?.id ?? null,
    address: item?.address ?? item?.id,
    image: item?.image ?? item?.info?.image ?? (item?.prepared ? item?.prepared?.logoURI : null),
    name: item.name,
    blockchain: item.blockchain,
    slug: item?.slug ?? item?.symbol.toUpperCase(),
    price: item?.price ?? ((item?.info?.current_price ?? item?.tokenDayData[0]?.priceUSD ?? 0) * 1).toFixed(4),
    high: item?.high ?? ((item?.info?.high_24h ?? item?.tokenDayData[0]?.high ?? 0) * 1).toFixed(4),
    low: item?.low ?? ((item?.info?.low_24h ?? item?.tokenDayData[0]?.low ?? 0) * 1).toFixed(4),
    open: item?.open ?? ((item?.tokenDayData[0]?.open ?? 0) * 1).toFixed(4),
    close: item?.close ?? ((item?.tokenDayData[0]?.close ?? 0) * 1).toFixed(4),
    currency: item?.currency ?? currency.toUpperCase(),
    volume: item?.volume ?? ((item?.info?.total_volume ?? item?.volumeUSD ?? 0) * 1).toFixed(4),
    tvl: item?.tvl ?? ((item?.info?.total_value_locked ?? item?.totalValueLockedUSD ?? 0) * 1).toFixed(4),
    description: item?.description ?? item?.info?.description ?? null,
    tokenCount: item?.tokenCount ?? item?.info?.total_supply ?? item?.totalSupply ?? 0,
    onSaleCount: item?.onSaleCount ?? item?.info?.circulating_supply ?? 0,
    discordUrl: null,
    externalUrl: item?.externalUrl ?? item?.info?.homepage,
    twitterUrl: item?.twitterUrl ?? (item?.info?.twitter_screen_name ? `https://twitter.com/${item.info.twitter_screen_name}` : null),
    openseaVerificationStatus: null,
    ticker: item?.ticker ?? {
      value: Math.abs(item?.info?.price_change_percentage_24h ?? 0).toFixed(2),
      type: ((item?.info?.price_change_percentage_24h ?? 0) >= 0) ? 'plus' : 'minus',
    },
    isFull: item?.isFull ?? item?.info?.isFull,
  }
}

const convertFullToInfo = (full) => {
  return {
    ...full,
    isFull: true,
    image: full?.image?.large,
    current_price: full?.market_data?.current_price?.usd,
    high_24h: full?.market_data?.high_24h?.usd,
    low_24h: full?.market_data?.low_24h?.usd,
    total_value_locked: full?.market_data?.total_value_locked,
    description: full?.description?.en,
    total_supply: full?.market_data?.total_supply,
    circulating_supply: full?.market_data?.circulating_supply,
    homepage: full?.links?.homepage[0],
    twitter_screen_name: full?.links?.twitter_screen_name,
    price_change_percentage_24h: full?.market_data?.price_change_percentage_24h,
  }
}

export const sortTokens = (tokens, sortType) => {
  const [sortField, sortVerctor] = sortType.split(':')
  const sortedMarkets = [...tokens].sort((a, b) => {
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

export const tokenSlice = createSlice({
  name: '$token',

  initialState: {
    fetching: false,
    all: [],
    searched: [],
    prepared: [],
    ids: [],
    current: {},
    loading: true,
    page: 1,
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

    prepared: (state, { payload }) => {
      state.prepared = payload
    },

    ids: (state, { payload }) => {
      state.ids = payload
    },

    current: (state, { payload }) => {
      state.current = payload
    },

    update: (state, { payload }) => {
      state.all = state.all.map(item => {
        if (item.address.toLowerCase() == payload.address.toLowerCase()) {
          return payload
        } else {
          return item
        }
      })
    },

    page: (state, { payload }) => {
      state.page = payload
    },

    pages: (state, { payload }) => {
      const current = state.pages.history.find(item => item == state.page) ?? 1
      const currentIndex = state.pages.history.indexOf(state.page)
      const history = currentIndex > 0 ? state.pages.history.slice(0, currentIndex + 1) : [1]
      history.push(payload)

      state.pages = {
        current,
        history,
      }
    },

    pagesClear: (state) => {
      state.page = 1
      state.pages = {
        current: 1,
        history: [1],
      }
    },
  },
})

const getters = {
  client: createSelector([
    (state) => state.$app.code,
  ], (code) => {
    let uri = null
    switch (code) {
      case 'ethereum':
        uri = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
        break
      case 'polygon':
        uri = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon'
        break
      case 'arbitrum':
        uri = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-arbitrum-one'
        break
      case 'optimism':
        uri = 'https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis'
        break
    }

    if (uri) {
      const client = new ApolloClient({
        uri,
        cache: new InMemoryCache(),
        connectToDevTools: true,
      })

      return client
    }

    return null
  }),

  query: createSelector([
    (state) => state.$token.loading,
  ], (loading) => {
    return {
      tokens: gql`
        query tokens($skip: Int!, $orderBy: String, $orderDirection: String, $searchText: String) {
          tokens(first: 10, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: {or: [{ name_contains_nocase: $searchText }, { symbol_contains_nocase: $searchText }, { id: $searchText }] }) {
            id
            name
            symbol
            decimals
            totalSupply
            volume
            volumeUSD
            totalValueLocked
            totalValueLockedUSD
            derivedETH
            tokenDayData(orderBy: date, first: 1, orderDirection: desc) {
              id
              date
              priceUSD
              feesUSD
              open
              high
              low
              close
            }
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
            volume
            volumeUSD
            totalValueLocked
            totalValueLockedUSD
            derivedETH
            tokenDayData(orderBy: date, first: 1, orderDirection: desc) {
              id
              date
              priceUSD
              feesUSD
              open
              high
              low
              close
            }
          }
        }
      `,
    }
  }),

  all: createSelector([
    (state) => state.$token.all,
    (state) => state.$token.searched,
    (state) => state.$token.loading,
    (state) => state.$exchange.sortType,
  ], (all, searched, loading, sortType) => {
    return {
      tokens: sortTokens(all, sortType),
      searched: sortTokens(searched, sortType),
      isLoading: loading,
    }
  }),
  
  token: (key, value) => createSelector([
    (state) => state.$token.all,
    (state) => state.$token.searched,
  ], (all, searched) => {
    let token = all.find(c => c[key] === value)
    if (!token) {
      token = searched.find(c => c[key] === value)
    }

    return token
  }),

  pages: createSelector([
    (state) => state.$token.pages.history,
    (state) => state.$token.pages.current,
  ], (history, current) => {
    const currentIndex = history.indexOf(current)
    const prev = history.find((_, index) => (currentIndex > 0) ? index === (currentIndex - 1) : null) ?? null
    const next = history.find((_, index) => (currentIndex >= 0 && currentIndex < history.length - 1) ? index === (currentIndex + 1) : null) ?? null
    return { prev, next }
  }),

  ids: createSelector([
    (state) => state.$token.ids,
  ], (ids) => {
    return (addresses, platform) => {
      return addresses.map(address => {
        const foundId = ids.find(id => id.platforms.hasOwnProperty(platform) && id.platforms[platform].toLowerCase() == address)
        return foundId ? foundId.id : null
      }).filter(item => item != null)
    }
  }),
}

const api = {
  tokens: {
    optimism: (params) => {
      return request('optimism.tokenlist.json', 'GET', {api: 'optimism', ...params})
    },

    arbitrum: (params) => {
      return request('ArbTokenLists/arbed_arb_whitelist_era.json', 'GET', {api: 'arbitrum', ...params})
    },

    quickswap: (params) => {
      return request('build/quickswap-default.tokenlist.json', 'GET', {api: 'quickswap', ...params})
    },

    celo: (params) => {
      return request('celo-token-list/celo.tokenlist.json', 'GET', {api: 'celo', ...params})
    },

    bnb: (params) => {
      return request('plasmadlt/plasma-finance-token-list/master/bnb.json', 'GET', {api: 'bnb', ...params})
    },

    all: async () => {
      return Promise.all([
        api.tokens.optimism(),
        api.tokens.arbitrum(),
        api.tokens.quickswap(),
        api.tokens.celo(),
        api.tokens.bnb(),
      ]).then(([optimism, arbitrum, quickswap, celo, bnb]) => {
        return [...optimism.tokens, ...arbitrum.tokens, ...quickswap.tokens, ...celo.tokens, ...bnb.tokens]
      })
    },

    ids: (params) => {
      return request('coins/list', 'GET', {api: 'coingecko', ...params})
    },

    info: (params) => {
      return request('coins/markets', 'GET', {api: 'coingecko', ...params})
    },

    full: ({platform, address, ...params}) => {
      return request(`coins/${platform}/contract/${address}`, 'GET', {api: 'coingecko', ...params})
    },
  },
}

export default {
  reducer: tokenSlice.reducer,
  set: tokenSlice.actions,
  get: getters,
  api,
}