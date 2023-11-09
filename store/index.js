
import { configureStore } from '@reduxjs/toolkit'

import { CHAINS } from '@/config'

import $modal from './modal'
import $app, { appSlice } from './app'
import $exchange from './exchange'
import $collection, { collectionSlice } from './collection'
import $token, { tokenSlice } from './token'
import $nft from './nft'
import $orders from './orders'
import $raffle from './raffle'
import $markets from './markets'

const createStore = (initialData, page, info) => {
  return configureStore({
    reducer: {
      $modal: $modal.reducer,
      $app: $app.reducer,
      $exchange: $exchange.reducer,
      $collection: $collection.reducer,
      $token: $token.reducer,
      $nft: $nft.reducer,
      $orders: $orders.reducer,
      $raffle: $raffle.reducer,
      $markets: $markets.reducer,
    },

    preloadedState: {
      $app: {
        ...appSlice.getInitialState(),
        code: initialData.blockchain || 'ethereum',
        isMobile: initialData.isMobile,
      },
      $token: {
        ...tokenSlice.getInitialState(),
        list: initialData.marketsList,
        current: (page == 'exchange' ? info : {}),
      },
      $collection: {
        ...collectionSlice.getInitialState(),
        current: (page == 'nfts' ? info : {}),
      },
    }
  })
}

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/'
const UNISWAP_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3/'
const OPTIMISM_URL = 'https://static.optimism.io/'
const ARBITRUM_URL = 'https://tokenlist.arbitrum.io/'
const QUICKSWAP_URL = 'https://unpkg.com/quickswap-default-token-list@1.2.2/'
const CELO_URL = 'https://celo-org.github.io/'
const BNB_URL = 'https://raw.githubusercontent.com/'
const INCH_URL = 'https://limit-orders.1inch.io/v3.0/'

export const request = async (uri, method = 'GET', {blockchain, api, ...data} = {}) => {
  const currentChain = CHAINS.find(chain => chain.code === blockchain)

  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'content-type': 'application/json',
    },
  }

  if ( ! api) {
    options.headers['x-api-key'] = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY
  }

  let query = ''

  if (data) {
    if (method === 'GET') {
      query = queryBuilder(data)
    } else {
      options.body = JSON.stringify(data)
    }
  }

  let base_url = currentChain?.baseApiUrl + '/'
  if (api) {
    switch (api) {
      case 'remote':
        base_url = ''
        break
      case 'local':
        base_url = '/'
        break
      case 'coingecko':
        base_url = COINGECKO_URL
        break
      case 'uniswap':
        base_url = UNISWAP_URL
        break
      case 'optimism':
        base_url = OPTIMISM_URL
        break
      case 'arbitrum':
        base_url = ARBITRUM_URL
        break
      case 'quickswap':
        base_url = QUICKSWAP_URL
        break
      case 'celo':
        base_url = CELO_URL
        break
      case 'bnb':
        base_url = BNB_URL
        break
      case 'inch':
        base_url = `${INCH_URL}${currentChain.id}/`
        break
    }
  }

  const response = await fetch(`${base_url}${uri}${query}`, options).catch(errorHandler)

  if (response?.ok) {
    return responseHandler(response)
  }
  
  return errorHandler(response)
}

const responseHandler = async (response) => {
  return await response.json()
}

const errorHandler = async (response) => {
  return null
}

const queryBuilder = (data) => {
  const params = new URLSearchParams()
  for (const key in data) {
    if (data[key] != null) {
      if (typeof data[key] == 'object') {
        for (const value of data[key]) {
          params.append(key, value)
        }
      } else {
        params.append(key, data[key])
      }
    }
  }

  for (const key of params.keys()) {
    if (params.has(key)) {
      return `?${params}`
    }
  }
  
  return ''
}

export default createStore