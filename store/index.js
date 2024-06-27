
import { configureStore } from '@reduxjs/toolkit'

import $app, { appSlice } from './app'
import $alert from './alert'
import $token from './token'
import $orders from './orders'
import $portfolio from './portfolio'
import $gem from './gem'

const createStore = (initialData) => {
  let preloadedState = {}
  if (initialData) {
    preloadedState = {
      $app: {
        ...appSlice.getInitialState(),
        code: initialData.blockchain,
        size: {
          isMobile: initialData.isMobile,
        },
        chains: initialData.chains,
        isApp: initialData.isApp,
        platform: initialData.platform,
        initWallet: initialData.initWallet,
        appTheme: initialData.appTheme,
        devMode: initialData.devMode,
      },
    }
  }

  return configureStore({
    reducer: {
      $app: $app.reducer,
      $alert: $alert.reducer,
      $token: $token.reducer,
      $orders: $orders.reducer,
      $portfolio: $portfolio.reducer,
      $gem: $gem.reducer,
    },

    preloadedState,

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    })
  })
}

export const request = async (uri, method = 'GET', {api, ...data} = {}) => {
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
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

  const base_url = getBaseUrl(api)
  const response = await fetch(`${base_url}${uri}${query}`, options).catch(errorHandler)

  if (response && response?.status) {
    return responseHandler(response)
  }

  // if (response?.ok) {
  //   return responseHandler(response)
  // }

  // return errorHandler(response)
}

const responseHandler = async (response) => {
  if (response.status == 502) {
    return null
  }

  return await response.json()
}

const errorHandler = async (response) => {
  // console.log('errorHandler', response)
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

const getBaseUrl = (api) => {
  switch (api) {
    case 'remote':
      return ''
    case 'local':
      return '/'
    case 'bid':
      return process.env.NEXT_PUBLIC_BID_URL
    case 'accounts':
      return process.env.NEXT_PUBLIC_ACCOUNTS_URL
    case 'exchange':
      return process.env.NEXT_PUBLIC_EXCHANGE_URL
    case 'orderbook':
      return process.env.NEXT_PUBLIC_ORDERBOOK_URL
    default:
      return process.env.NEXT_PUBLIC_BACKEND_URL
  }
}

export default createStore
