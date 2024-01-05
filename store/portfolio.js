import { createSlice } from '@reduxjs/toolkit'
import { request } from './index'

export const portfolioSlice = createSlice({
  name: '$portfolio',

  initialState: {
    native: {
      value: 0,
      symbol: '',
    },
    usd: 0,
    ticker: {
      type: 'plus',
      percent: 0,
    },
    list: [],
    prefill: {
      address: null,
      side: 'buy',
      amount: 0,
    },
  },

  reducers: {
    details: (state, { payload }) => {
      const native = payload.data.find(item => item.type == 'native')
      state.native = {
        value: (native?.balance ?? 0).toFixed(4),
        symbol: native?.symbol,
      }

      state.list = payload.data.filter(item => item.price > 1 && !['narive'].includes(item.type) || item.balance > 1 && ['quote'].includes(item.type)).map(item => {
        return {
          address: item.address,
          name: item.name,
          symbol: item.symbol,
          image: item.image || `https://storage.googleapis.com/token-assets/assets/${payload?.blockchain?.code}/${item.address.toLowerCase()}.png`,
          balance: item.balance.toFixed(4),
          price: item.price || (item.type == 'quote' ? item.balance : 0),
          usd: (item.price || (item.type == 'quote' ? item.balance : 0)).toFixed(4),
          ticker: {
            type: item.price_change_24_h > 0 ? 'plus' : item.price_change_24_h < 0 ? 'minus' : 'zero',
            price_change_24_h: item.price_change_24_h,
            percent: item.price_change_24_h.toFixed(2),
          },
          isNative: item.type == 'native',
          isUsdt: item.type == 'quote',
        }
      })

      const usd = state.list.reduce((acc, item) => {
        return acc + item.price
      }, 0)
      state.usd = usd.toFixed(4)

      // const usdTicker = state.list.reduce((acc, item) => {
      //   return acc + (item.price * item.ticker.price_change_24_h / 100)
      // }, 0)

      // const percent = usd != 0 ? (Math.round((usdTicker * 100 / usd) * 100) / 100) : 0
      // state.ticker = {
      //   type: percent > 0 ? 'plus' : percent < 0 ? 'minus' : 'zero',
      //   percent: percent.toFixed(2),
      // }
    },

    native: (state, { payload }) => {
      state.native = payload
    },

    prefill: (state, { payload }) => {
      state.prefill = payload
    },
  },
})

const api = {
  details: (params) => {
    return request(`wallet/balances/${params.blockchain.id}/${params.wallet}`)
  },
}

export default {
  reducer: portfolioSlice.reducer,
  set: portfolioSlice.actions,
  api,
}