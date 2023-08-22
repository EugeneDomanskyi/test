
import { configureStore } from '@reduxjs/toolkit'

import $modal from './modal'
import $app, { appSlice } from './app'
import $exchange from './exchange'
import $collection from './collection'
import $nft from './nft'
import { CHAINS } from '@/config'

const createStore = initialData => {
  return configureStore({
    reducer: {
      $modal: $modal.reducer,
      $app: $app.reducer,
      $exchange: $exchange.reducer,
      $collection: $collection.reducer,
      $nft: $nft.reducer,
    },
    preloadedState: {
      $app: {
        ...appSlice.getInitialState(),
        code: initialData.blockchain || 'ethereum',
        isMobile: initialData.isMobile,
      }
    }
  })
}

export const request = async (uri, method = 'GET', {blockchain, ...data} = {}) => {
  const currentChain = CHAINS.find(chain => chain.code === blockchain)
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
    },
  }

  let query = ''

  if (data) {
    if (method === 'GET') {
      query = queryBuilder(data)
    } else {
      options.body = JSON.stringify(data)
    }
  }
  const response = await fetch(`${currentChain.baseApiUrl}/${uri}${query}`, options)
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