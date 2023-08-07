
import { configureStore } from '@reduxjs/toolkit'

import $modal from './modal'
import $app, { appSlice } from './app'
import $exchange from './exchange'
import $collection from './collection'
import $token from './token'
import $nft from './nft'

const createStore = initialData => {
  return configureStore({
    reducer: {
      $modal: $modal.reducer,
      $app: $app.reducer,
      $exchange: $exchange.reducer,
      $collection: $collection.reducer,
      $token: $token.reducer,
      $nft: $nft.reducer,
    },

    preloadedState: {
      $app: {
        ...appSlice.getInitialState(),
        code: initialData.blockchain || 'polygon',
        isMobile: initialData.isMobile,
      }
    }
  })
}

const BLOCKCHAIN_URL = {
  polygon: 'https://api-polygon.reservoir.tools',
  ethereum: 'https://api.reservoir.tools',
  goerli: 'https://api-goerli.reservoir.tools',
}

const COINGECKO_URL = 'https://api.coingecko.com/api/v3'
const UNISWAP_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
const OPTIMISM_URL = 'https://static.optimism.io'
const ARBITRUM_URL = 'https://tokenlist.arbitrum.io'
const QUICKSWAP_URL = 'https://unpkg.com/quickswap-default-token-list@1.2.2'
const CELO_URL = 'https://celo-org.github.io'
const BNB_URL = 'https://raw.githubusercontent.com'

export const request = async (uri, method = 'GET', {blockchain, api, ...data} = {}) => {
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
    },
  }

  if ( ! api) {
    options.headers['Content-Type'] = 'application/json'
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

  let base_url = BLOCKCHAIN_URL[blockchain]
  if (api) {
    switch (api) {
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
    }
  }

  const response = await fetch(`${base_url}/${uri}${query}`, options)
  if (response.ok) {
    return responseHandler(response)
  }
  return errorHandler(response)
}

const responseHandler = async (response) => {
  return await response.json()
}

const errorHandler = async (response) => {
  // console.log(response)
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
  return `?${params}`
}

export default createStore