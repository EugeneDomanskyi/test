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
      usd: 0,
    },
    list: [],
  },

  reducers: {
    details: (state, { payload }) => {
      const native = payload.find(item => item.info?.tags.includes('native'))
      state.native = {
        value: (native?.amount ?? 0).toFixed(4),
        symbol: native?.info?.symbol,
      }

      const usd = payload.reduce((acc, item) => {
        return acc + item.value_usd
      }, 0)
      state.usd = usd.toFixed(4)

      state.list = payload.map(item => {
        return {
          address: item.contract_address,
          name: item.info?.name,
          symbol: item.info?.symbol,
          decimals: item.decimals,
          image: item.info?.image,
          balance: item.amount.toFixed(4),
          usd: item.value_usd.toFixed(4),
          price: item.price_to_usd,
          ticker: {
            type: item.abs_profit_usd >= 0 ? 'plus' : 'minus',
            percent: (item.roi * 100).toFixed(2),
            usd: item.abs_profit_usd.toFixed(4),
          },
          isNative: native?.contract_address == item.contract_address,
          isUsdt: item.info?.symbol == 'USDT',
        }
      })

      const usdTicker = payload.reduce((acc, item) => {
        return acc + item.abs_profit_usd
      }, 0)
      state.ticker = {
        type: usdTicker >= 0 ? 'plus' : 'minus',
        percent: (usdTicker * 100 / usd).toFixed(2),
        usd: usdTicker.toFixed(4),
      }
    },

    native: (state, { payload }) => {
      state.native = payload
    },
  },
})

const api = {
  details: (params) => {
    return request(`api/portfolio/${params.wallet}/${params.blockchain.id}/${params.blockchain.code}`, 'GET', { api: 'local' })
  },
}

export default {
  reducer: portfolioSlice.reducer,
  set: portfolioSlice.actions,
  api,
}