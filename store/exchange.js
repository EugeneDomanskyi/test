import { createSlice, createSelector } from '@reduxjs/toolkit'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

import { request } from './index'
import { CHAINS } from '@/config'

const round = (date, duration, method) => {
  return moment(Math[method]((+date) / (+duration)) * (+duration))
}

const generatePeriods = (from, to, closePrice, step) => {
  const start = moment(from, 'DD-MM-YY HH:mm')
  const end = moment(to, 'DD-MM-YY HH:mm')
  const range = moment.range(start, end)
  const array = Array.from(range.by(step.unit, {step: step.count, excludeEnd: true})).slice(1)
 return array.reduce((acc, time) => {
    const roundedDate = time.format('DD-MM-YY HH:mm')
    return {
      ...acc,
      [roundedDate]: [{
        date: time,
        roundedDate: roundedDate,
        volume: 0,
        price: closePrice,
        timestamp: time.unix()*1000,
      }]
    }
  }, {})
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
    interval: {key: '4h', count: 4, unit: 'hours', seconds: 4*60*60},
    sortType: 'VOLUME:DESC',
    loading: false,
    chartData: {
      tokens: [],
    }
  },

  reducers: {
    orderBook: (state, {payload}) => {
      state.orderBook = payload
    },
    orders: (state, {payload}) => {
      state.orders = payload
    },
    orderUpdate: (state, {payload}) => {
      const exist = state.orders.find(o => o.id === payload.id)
      if (exist) {
        state.orders = state.orders.map(o => (o.id === payload.id ? payload : o))
      } else {
        state.orders = [payload, ...state.orders]
      }
    },
    sales: (state, {payload}) => {
      state.sales = payload
    },
    saleAdd: (state, {payload}) => {
      state.sales = [...state.sales, payload]
    },
    saleUpdate: (state, {payload}) => {
      state.sales = state.sales.map(s => (s.id === payload.id ? payload : s))
    },
    interval: (state, {payload}) => {
      state.interval = payload
    },
    sortType: (state, {payload}) => {
      state.sortType = payload
    },
    loading: (state, {payload}) => {
      state.loading = payload
    },
    chartData: (state, {payload}) => {
      state.chartData[payload.type] = payload.data
    }
  },
})

const getters = {
  kLineData: (interval) => createSelector([
    state => state.$exchange.sales,
  ], (sales) => {
    const groupedSales = sales.reduce((acc, sale) => {
      const roundedDate = round(moment(sale.timestamp*1000), moment.duration(interval.count, interval.unit), 'ceil')
      const intervalKey = roundedDate.format('DD-MM-YY HH:mm')
      const formattedData = {
        price: sale.price.amount.native,
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

    let previousRoundedDate = ''
    let previousClosePrice = 0

    const temp = Object.entries(groupedSales).reduce((acc, [time, sales]) => {
      let emptyPeriods = {}
      const isNext = !previousRoundedDate
      if (!isNext) {
        emptyPeriods = generatePeriods(time, previousRoundedDate, previousClosePrice, {count: interval.count, unit: interval.unit})
      }
      previousRoundedDate = time
      previousClosePrice = sales.sort((a, b) => b.timestamp - a.timestamp)[0].price
      return {
        ...acc,
        ...emptyPeriods,
        [time]: sales,
      }
    }, {})

    const result = Object.entries(temp).map(([intervalKey, sales]) => {
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
    return result.sort((a,b) => a.time - b.time)
  }),

  highLow: (interval) => createSelector([
    state => state.$exchange.sales
  ], (sales) => {
    const now = moment()
    const from = moment().subtract(interval.count, interval.unit)
    const prices = sales
      .filter(sale => moment(sale.updatedAt).isAfter(from) && moment(sale.updatedAt).isBefore(now))
      .map((sale) => sale.price.amount.native)
    return {
      low: prices.length ? Math.min(...prices) : 0,
      high: prices.length ? Math.max(...prices) : 0,
    }
  }),

  recentSales: (limit) => createSelector([
    state => state.$exchange.sales
  ], (sales) => {
    return sales.slice(0, limit).map(sale => ({...sale, priceFormatted: sale.price.amount.native}))
  }),

  orderBook: createSelector([
    state => state.$exchange.orderBook
  ], (orderBook) => {
    return {
      buy: orderBook.buy.slice(0, 10),
      sell: orderBook.sell.slice(0, 10),
    }
  }),

  orders: createSelector([
    state => state.$exchange.orders
  ], (orders) => {
    return orders.filter(order => order.status !== 'cancelled').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }),

  chartData: createSelector([
    state => state.$exchange.chartData.tokens
  ], (chartData) => {
    return chartData.map((item) => ({...item, time: item.time*1000}))
  })
}

const api = {
  get: {
    orderBook: (params) => {
      return Promise.all([
        // APIInterface.Inch.request(`137/address/0xc2132d05d31c914a87c6611c10748aeb04b58e8f`, 'GET', {...params, statuses: [1,2], limit: 10, sortBy: 'makerRate'})
        request('orders/depth/v1', 'GET', {side: 'buy', ...params}),
        request('orders/depth/v1', 'GET', {side: 'sell', ...params}),
      ]).then(([buy, sell]) => {
        return {buy: buy ? buy.depth : [], sell: sell ? sell.depth : []}
      })
    },
    sales: (params) => {
      return request('sales/v6', 'GET', params).then(res => res.sales)
    },
    orders: (params) => {
      return Promise.all([
        request('orders/bids/v6', 'GET', params),
        request('orders/asks/v5', 'GET', params),
      ]).then(([bids, asks]) => {
        return [...bids.orders, ...asks.orders]
      })
    },
    bids: (params) => {
      return request('orders/bids/v6', 'GET', params).then(res => {
        return res.orders
      })
    },
    tokenChartData: (buyAsset, blockchain, interval) => {
      const network = CHAINS.find(chain => chain.code === blockchain)
      return fetch(`https://charts.1inch.io/v1.0/chart/aggregated/candle/${buyAsset}/${network.usdtContract}/${interval}/${network.id}`)
        .then(async res => res.ok ? await res.json() : null)
    }
  },
  executeOrder: (params) => {
    return request('execute/bid/v5', 'POST', params)
  }
}

export default {
  reducer: exchangeSlice.reducer,
  set: exchangeSlice.actions,
  get: getters,
  api: api,
}