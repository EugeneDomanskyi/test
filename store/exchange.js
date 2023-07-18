import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'

import { request } from './index'

const round = (date, duration, method) => {
  return moment(Math[method]((+date) / (+duration)) * (+duration))
}

export const exchangeSlice = createSlice({
  name: '$exchange',
  initialState: {
    orderBook: {
      buy: [],
      sell: [],
    },
    sales: [],
    orders: [],
    interval: {key: '15m', count: 15, unit: 'minutes'},
    sortType: 'VOLUME:DESC',
  },

  reducers: {
    orderBook: (state, {payload}) => {
      state.orderBook = payload
    },
    orders: (state, {payload}) => {
      state.orders = payload
    },
    orderAdd: (state, {payload}) => {
      state.orders = [payload, ...state.orders]
    },
    orderUpdate: (state, {payload}) => {
      state.orders = state.orders.map(o => (o.id === payload.id ? payload : o))
    },
    sales: (state, {payload}) => {
      state.sales = payload
    },
    interval: (state, {payload}) => {
      state.interval = payload
    },
    sortType: (state, {payload}) => {
      state.sortType = payload
    }
  },
})

const getters = {
  kLineData: (interval) => ({$exchange}) => {
    const groupedSales = $exchange.sales.reduce((acc, sale) => {
      const roundedDate = round(moment(sale.timestamp*1000), moment.duration($exchange.interval.count, $exchange.interval.unit), 'ceil')
      const intervalKey = roundedDate.format('DD-MM-YY HH:mm')
      const formattedData = {
        price: sale.price.amount.decimal,
        timestamp:  sale.timestamp*1000,
        volume: sale.amount*1,
        roundedDate: roundedDate.format('DD-MM-YY HH:mm'),
        date: roundedDate,
      }
      const list = acc[intervalKey] ? [...acc[intervalKey], formattedData] : [formattedData]
      return {
        ...acc,
        [intervalKey]: list
      }
    }, {})

    const result =  Object.entries(groupedSales).map(([intervalKey, sales]) => {
      const { timestamps, prices, volume } = sales.reduce((acc, sale) => {
        return {
          timestamps: [...acc.timestamps, sale.timestamp],
          prices: [...acc.prices, sale.price],
          volume: acc.volume + sale.volume,
        }
      }, {timestamps: [], prices: [], volume: 0})
      const openKey = Math.min(...timestamps)
      const closeKey = Math.max(...timestamps)
      const data = sales.reduce((acc, sale) => {
        return {
          ...acc,
          [sale.timestamp]: sale,
        }
      }, {})

      return {
        open: data[openKey].price,
        close: data[closeKey].price,
        low: Math.min(...prices),
        high: Math.max(...prices),
        volume: volume,
        time: sales[0].date.unix()*1000
      }
    })
    return result.reverse()
  }
}

const api = {
  get: {
    orderBook: (params) => {
      return Promise.all([
        request('orders/depth/v1', 'GET', {side: 'buy', ...params}),
        request('orders/depth/v1', 'GET', {side: 'sell', ...params}),
      ]).then(([buy, sell]) => {
        return {buy: buy ? buy.depth : [], sell: sell ? sell.depth : []}
      })
    },
    sales: (params) => {
      return request('sales/v5', 'GET', params).then(res => res.sales)
    },
    orders: (params) => {
      return Promise.all([
        request('orders/bids/v6', 'GET', params),
        request('orders/asks/v5', 'GET', params),
      ]).then(([bids, asks]) => {
        return [...bids.orders, ...asks.orders]
      })
    }
  },
}

export default {
  reducer: exchangeSlice.reducer,
  set: exchangeSlice.actions,
  get: getters,
  api: api,
}