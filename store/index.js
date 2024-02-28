
import { configureStore } from '@reduxjs/toolkit'

import $app, { appSlice } from './app'
import $alert from './alert'
import $token from './token'
import $orders from './orders'
import $raffle from './raffle'
import $markets from './markets'
import $portfolio from './portfolio'
import $tournament from './tournament'

const createStore = (initialData) => {
  return configureStore({
    reducer: {
      $app: $app.reducer,
      $alert: $alert.reducer,
      $token: $token.reducer,
      $orders: $orders.reducer,
      $raffle: $raffle.reducer,
      $markets: $markets.reducer,
      $portfolio: $portfolio.reducer,
      $tournament: $tournament.reducer,
    },

    preloadedState: {
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
        devMode: initialData.devMode,
      },
    },

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

  const base_url = api == 'remote' ? '' : (api == 'local' ? '/' : process.env.NEXT_PUBLIC_BACKEND_URL)
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

  for (const key of params.keys()) {
    if (params.has(key)) {
      return `?${params}`
    }
  }
  
  return ''
}

export default createStore