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
      const native = payload.find(item => item.info?.tags.includes('native'))
      state.native = {
        value: (native?.balance ?? 0).toFixed(4),
        symbol: native?.symbol,
      }

      const usd = payload.reduce((acc, item) => {
        return acc + item.balance
      }, 0)
      state.usd = usd.toFixed(4)

      state.list = payload.map(item => {
        return {
          address: item.address,
          name: item.name,
          symbol: item.symbol,
          image: item.image,
          balance: item.balance.toFixed(4),
          usd: item.balance.toFixed(4),
          ticker: {
            type: item.price_change_24_h > 0 ? 'plus' : item.price_change_24_h < 0 ? 'minus' : 'zero',
            percent: item.price_change_24_h.toFixed(2),
          },
          isNative: native?.address == item.address,
          isUsdt: item.symbol == 'USDT',
        }
      })

      const usdTicker = payload.reduce((acc, item) => {
        return acc + item.balance
      }, 0)

      const percent = usd != 0 ? (Math.round((usdTicker * 100 / usd) * 100) / 100) : 0
      state.ticker = {
        type: percent > 0 ? 'plus' : percent < 0 ? 'minus' : 'zero',
        percent: percent.toFixed(2),
      }
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
    return request(`api/portfolio/${params.wallet}/${params.blockchain.id}/${params.blockchain.code}`, 'GET', { api: 'local' })
  },

  details2: (params) => {
    return request(`wallet/balances/${params.blockchain.id}/${params.wallet}`, 'GET', { api: 'backend' })
  },
}

export default {
  reducer: portfolioSlice.reducer,
  set: portfolioSlice.actions,
  api,
}