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
    collections: [],
  },

  reducers: {
    orderBook: (state, {payload}) => {
      state.orderBook = payload
    },
    sales: (state, {payload}) => {
      state.sales = payload
    },
    collections: (state, {payload}) => {
      state.collections = payload
    }
  },
})

const getters = {
  kLineData: (interval) => ({$exchange}) => {
    
    const groupedSales = $exchange.sales.reduce((acc, sale) => {
      const intervalKey = moment(sale.timestamp*1000).format('YY-MM-DDTHH')
      const roundedDate = round(moment(sale.timestamp*1000), moment.duration(15, 'minutes'), 'ceil')
      const groupTime = moment(intervalKey, 'YY-MM-DDTHH')
      const formattedData = {
        price: sale.price.amount.native,
        timestamp:  sale.timestamp*1000,
        volume: sale.amount*1,
        groupTime: groupTime.format('DD-MM-YY HH:mm'),
        roundedDate: roundedDate.format('DD-MM-YY HH:mm'),
        date: groupTime,
      }
      const list = acc[intervalKey] ? [...acc[intervalKey], formattedData] : [formattedData]
      return {
        ...acc,
        [intervalKey]: list
      }
    }, {})

    console.log(groupedSales)

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
    return result
  }
}

const api = {
  get: {
    orderBook: (params) => {
      return Promise.all([
        request('orders/depth/v1', 'GET', {side: 'buy', ...params}),
        request('orders/depth/v1', 'GET', {side: 'sell', ...params}),
      ]).then(([buy, sell]) => {
        return {buy: buy ? buy.depth.slice(0, 10) : [], sell: sell ? sell.depth.slice(0, 10) : []}
      })
    },
    sales: (params) => {
      return request('sales/v5', 'GET', params).then(res => res.sales)
    },
    topCollections: (params) => {
      return request('collections/top-selling/v1', 'GET', params).then(res => res.collections)
    }
  },
  bids: (params) => {
    return request('orders/bids/v6', 'GET', params)
  }
}

export default {
  reducer: exchangeSlice.reducer,
  set: exchangeSlice.actions,
  get: getters,
  api: api,
}