
import { configureStore } from '@reduxjs/toolkit'

import TelegramBot from '@/libs/TelegramBot'

import $app, { appSlice } from './app'
import $alert from './alert'
import $token from './token'
import $orders from './orders'
import $portfolio from './portfolio'
import $gem from './gem'
import $bot from './bot'
import $auction from './auction'

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
      $bot: $bot.reducer,
      $auction: $auction.reducer,
    },

    preloadedState,

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    })
  })
}

export const request = async (uri, method = 'GET', {api, jwt_token, ...data} = {}, formData = null) => {
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
    },
  }

  if (TelegramBot.getInitData()) {
    options.headers['X-Init-Data'] = TelegramBot.getInitData()
  }

  if (jwt_token) {
    options.headers['Authorization'] = jwt_token
  }

  if (api == 'payram') {
    options.headers['API-Key'] = process.env.NEXT_PUBLIC_PAYRAM_API_KEY
  }

  let query = ''
  if (formData) {
    options.body = formData
  } else {
    options.headers['Content-Type'] = 'application/json'
    if (data) {
      if (method === 'GET') {
        query = queryBuilder(data)
      } else {
        options.body = JSON.stringify(data)
      }
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
  if (response.status == 500 || response.status == 502 || response.status == 404) {
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
    case 'admin':
      return process.env.NEXT_PUBLIC_ADMIN_URL
    case 'bid':
      return process.env.NEXT_PUBLIC_BID_URL
    case 'bid_v2':
      return process.env.NEXT_PUBLIC_BID_V2_URL
    case 'accounts':
      return process.env.NEXT_PUBLIC_ACCOUNTS_URL
    case 'exchange':
      return process.env.NEXT_PUBLIC_EXCHANGE_URL
    case 'orderbook':
      return process.env.NEXT_PUBLIC_ORDERBOOK_URL
    case 'bot':
      return process.env.NEXT_PUBLIC_BOT_URL
    case 'payram':
      return process.env.NEXT_PUBLIC_PAYRAM_URL
    default:
      return process.env.NEXT_PUBLIC_BACKEND_URL
  }
}

export default createStore
