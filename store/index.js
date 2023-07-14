
import { configureStore } from '@reduxjs/toolkit'

import $modal from './modal'
import $app from './app'
import $exchange from './exchange'

const BASE_URL = 'https://api-polygon.reservoir.tools'

const store = configureStore({
  reducer: {
    $modal: $modal.reducer,
    $app: $app.reducer,
    $exchange: $exchange.reducer,
  },
})

export const request = async (uri, method = 'GET', data) => {
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
  const response = await fetch(`${BASE_URL}/${uri}${query}`, options)
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
  const params = new URLSearchParams(data)
  return `?${params}`
}

export default store