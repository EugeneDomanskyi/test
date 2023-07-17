
import { configureStore } from '@reduxjs/toolkit'

import $modal from './modal'
import $app from './app'
import $exchange from './exchange'
import $collection from './collection'
import $nft from './nft'

const store = configureStore({
  reducer: {
    $modal: $modal.reducer,
    $app: $app.reducer,
    $exchange: $exchange.reducer,
    $collection: $collection.reducer,
    $nft: $nft.reducer,
  },
})

const BLOCKCHAIN_URL = {
  polygon: 'https://api-polygon.reservoir.tools',
  ethereum: 'https://api.reservoir.tools',
  goerli: 'https://api-goerli.reservoir.tools',
}

export const request = async (uri, method = 'GET', {blockchain, ...data} = {}) => {
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
  const response = await fetch(`${BLOCKCHAIN_URL[blockchain]}/${uri}${query}`, options)
  if (response.ok) {
    return responseHandler(response)
  }
  return errorHandler(response)
}

const responseHandler = async (response) => {
  return await response.json()
}

const errorHandler = async (response) => {
  console.log(response)
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

export default store