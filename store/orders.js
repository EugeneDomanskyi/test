import { createSlice, createSelector } from '@reduxjs/toolkit'
import numeral from 'numeral'
import moment from 'moment'
import { formatUnits } from 'viem'

import { request } from './index'
import Order from '@/libs/structs/Order'
import { INCH_TOKENS, CHAINS } from '@/config'


const round = (date, duration, method) => {
  return moment(Math[method]((+date) / (+duration)) * (+duration))
}

const toFixed = (value, precision, direction) => {
  let str = value.toString()
  if (str.indexOf('.') == -1) {
    str += '.0'
  }
  let [num, dec] = str.split('.')
  if (direction === 'down') {
    dec = dec.substring(0, precision)
    return `${num}.${dec}`
    // const multipler = Math.pow(10, precision)
    // const formatted = `${Math.floor((value*1) * multipler) / multipler}`
    // return formatted
  } else {
    const multipler = Math.pow(10, precision)
    const formatted = `${Math.ceil((value*1) * multipler) / multipler}`
    return formatted
  }
}

const addSide = (list, side) => {
  if (list && Array.isArray(list)) {
    return list.map(item => {
      const makerAsset = INCH_TOKENS[item.data.makerAsset]
      const takerAsset = INCH_TOKENS[item.data.takerAsset]
    
      if (!makerAsset || !takerAsset) {
        return {}
      }
      const order = Order.TOKEN.formatter(item, makerAsset.decimals, takerAsset.decimals)
      
      const makerPrice = order.makingAmountFormatted / order.takingAmountFormatted
      const takerPrice = order.takingAmountFormatted / order.makingAmountFormatted
      
      const price = side === 'buy' ? makerPrice : takerPrice
      const amount = side === 'buy' ? order.takingAmountFormatted : order.makingAmountFormatted
      // const amountFormatted = toFixed(side === 'buy' ? order.takingAmountFormatted : order.makingAmountFormatted, 6, 'up')
      const priceFormatted = numeral(toFixed(price, 6, side === 'sell' ? 'up' : 'down')).format('0.0[00000]')
      return {
        ...item,
        side: side,
        price: price,
        priceFormatted: priceFormatted,
        amount: amount,
        quantity: amount,
        timestamp: moment(item.createDateTime).unix(),
      }
    })
  }
  return []
}

const tradeFormatter = list => {
  if (list && Array.isArray(list)) {
    return list.map(item => {
      const makerAsset = INCH_TOKENS[item.data.makerAsset]
      const takerAsset = INCH_TOKENS[item.data.takerAsset]
    
      if (!makerAsset || !takerAsset) {
        return {}
      }
      
      const makingAmountFormatted = Math.pow(10, -makerAsset.decimals)*item.data.makingAmount //formatUnits(item.data.makingAmount, makerAsset.decimals)
      const takingAmountFormatted = Math.pow(10, -takerAsset.decimals)*item.data.takingAmount//formatUnits(item.data.takingAmount, takerAsset.decimals)
      
      const side = makerAsset.symbol === 'USDT' ? 'buy' : 'sell'

      const makerPrice = makingAmountFormatted / takingAmountFormatted
      const takerPrice = takingAmountFormatted / makingAmountFormatted
      
      const makerAmount = Math.pow(10, -makerAsset.decimals)*item.data.makingAmount //side === 'sell' ? makingAmountFormatted : takingAmountFormatted
      const takerAmount = Math.pow(10, -takerAsset.decimals)*item.data.takingAmount

      const timestamp = moment(item.createDateTime).unix()
      return {
        ...item,
        side: side,
        price: side === 'buy' ? makerPrice : takerPrice,
        priceFormatted: numeral(side === 'buy' ? makerPrice : takerPrice).format('0.0[00000]'),
        amount: numeral(side === 'buy' ? takerAmount : makerAmount).format('0.0[00000]'),
        quantity: numeral(side === 'buy' ? takerAmount : makerAmount).format('0.0[00000]'),
        timestamp: timestamp,
      }
    })
  }
  return []
}

const groupByPrice = (data, sort = 'asc') => {
  const temp = {}
  for (const item of data) {
    if (!isNaN(item.priceFormatted) && item.price) {
      if ( ! temp[item.priceFormatted]) {
        temp[item.priceFormatted] = item
      } else {
        temp[item.priceFormatted] = {
          ...temp[item.priceFormatted],
          amount: (temp[item.priceFormatted].amount * 1 + item.amount * 1),
          quantity: (temp[item.priceFormatted].quantity * 1 + item.quantity * 1),
        }
      }
    }
  }
  
  const array = Object.keys(temp).map(key => temp[key])
  array.sort((a, b) => sort == 'asc' ? (a.price - b.price) : (b.price - a.price))
  return array

  // const array = [...data]
  // array.sort((a, b) => sort == 'asc' ? (a.price - b.price) : (b.price - a.price))
  // return array
}

const generatePeriods = (from, to, closePrice, step) => {
  const start = moment(from)
  const end = moment(to)
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

export const ordersSlice = createSlice({
  name: '$orders',
  initialState: {
    nfts: [],
    tokens: [],
    orderBooks: {
      nfts: {
        buy: [],
        sell: [],
      },
      tokens: {
        buy: [],
        sell: [],
      },
    },
    trades: {
      nfts: [],
      tokens: [],
    }
  },

  reducers: {
    tokens: (state, {payload}) => {
      state.tokens = payload
    },
    nfts: (state, {payload}) => {
      state.nfts = payload
    },
    orderBook: (state, {payload}) => {
      state.orderBooks[payload.type] = payload.data
    },
    trades: (state, {payload}) => {
      state.trades[payload.type] = payload.data
    }
  },
})

const getters = {
  nfts: createSelector([
    state => state.$orders.nfts,
  ], (orders) => {
    return orders.map(order => {
      return new Order.NFT(order)
    })
  }),
  tokens: createSelector([
    state => state.$orders.tokens
  ], (orders) => {
    return orders.map(order => {
      return new Order.TOKEN(order)
    })
  }),
  orderBook: (type) => createSelector([
    state => state.$orders.orderBooks[type]
  ], (orderBook) => {
    return {
      buy: orderBook.buy.slice(0, 10).map(item => ({...item, priceFormatted: item.priceFormatted ?? item.price})),
      sell: orderBook.sell.slice(0, 10).map(item => ({...item, priceFormatted: item.priceFormatted ?? item.price})),
    }
  }),
  recentTrades: (type, limit) => createSelector([
    state => state.$orders.trades[type]
  ], (trades) => {
    return trades.filter(order => {
      return (order.priceFormatted !== 'NaN') && (order.orderInvalidReason === 'order filled' || type === 'nfts')
    }).map(sale => {
      return {
        ...sale,
        priceFormatted: sale.priceFormatted ?? sale.price.amount.native,
      }
    }).slice(0, limit)
  }),

  kLineData: (interval) => createSelector([
    state => state.$orders.trades.tokens,
  ], (sales) => {
    const groupedSales = sales.reduce((acc, sale) => {
      const roundedDate = round(moment(sale.timestamp*1000), moment.duration(interval.count, interval.unit), 'ceil')
      const intervalKey = roundedDate.unix()
      const formattedData = {
        price: sale.priceFormatted * 1,
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
}

const api = {
  get: {
    tokens: ({address, blockchain, ...rest}) => {
      return request(`address/${address}`, 'GET', {api: 'inch', blockchain, ...rest}).then(res => {
        if (res && Array.isArray(res)) {
          return res.map(order => ({...order, network: blockchain}))
        }
        return []
      })
    },
    nfts: (params) => {
      return Promise.all([
        request('orders/bids/v6', 'GET', params),
        request('orders/asks/v5', 'GET', params),
      ]).then(([bids, asks]) => {
        return [...bids.orders, ...asks.orders]
      })
    },
  },
  create: {
    token: (params) => {
      return request(`limit-order`, 'POST', {api: 'inch', ...params})
    }
  }
}

api.get.nfts.orderBook = (params) => {
  return Promise.all([
    request('orders/depth/v1', 'GET', {side: 'buy', ...params}),
    request('orders/depth/v1', 'GET', {side: 'sell', ...params}),
  ]).then(([buy, sell]) => {
    return {buy: buy ? buy.depth : [], sell: sell ? sell.depth : []}
  })
}

api.get.tokens.orderBook = ({address, ...rest}) => {
  const network = CHAINS.find(chain => chain.code === rest.blockchain)
  return Promise.all([
    request('all', 'GET', {api: 'inch', takerAsset: address, makerAsset: network.usdtContract, sortBy: 'takerRate', ...rest}),
    request('all', 'GET', {api: 'inch', makerAsset: address, takerAsset: network.usdtContract, sortBy: 'makerRate', ...rest}),
  ]).then(([buy, sell]) => {
    const sortedBuy = groupByPrice(addSide(buy, 'buy'), 'desc')
    const sortedSell = groupByPrice(addSide(sell, 'sell'), 'asc')
    return {buy: sortedBuy, sell: sortedSell}
  })
}

api.get.tokens.trades = ({address, blockchain, ...rest}) => {
  const network = CHAINS.find(chain => chain.code === blockchain)
  return Promise.all([
    request('all', 'GET', {api: 'inch', takerAsset: address, makerAsset: network.usdtContract, blockchain, ...rest}),
    request('all', 'GET', {api: 'inch', makerAsset: address, takerAsset: network.usdtContract, blockchain, ...rest}),
  ]).then(([sell1, buy1]) => {
    return [
      tradeFormatter(buy1),
      tradeFormatter(sell1),
    ].flat()
  })
}

api.get.tokens.byAssets = ({makerAsset, takerAsset, blockchain, ...rest}) => {
  return request('all', 'GET', {api: 'inch', takerAsset: takerAsset, makerAsset: makerAsset, blockchain, ...rest})
}

export default {
  reducer: ordersSlice.reducer,
  set: ordersSlice.actions,
  get: getters,
  api: api,
}
