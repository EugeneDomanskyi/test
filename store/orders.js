import { createSlice, createSelector } from '@reduxjs/toolkit'
import moment from 'moment'
import { readContract } from '@wagmi/core'
import { formatUnits } from 'viem'

import { request } from './index'
import Order from '@/libs/structs/Order'
import { CHAINS } from '@/config'

const round = (date, duration, method) => {
  return moment(Math[method]((+date) / (+duration)) * (+duration))
}

const generatePeriods = (from, to, closePrice, step) => {
  const start = moment(from)
  const end = moment(to)
  const range = moment.range(start, end)
  const array = Array.from(range.by(step.unit, { step: step.count, excludeEnd: true })).slice(1)
  return array.reduce((acc, time) => {
    const roundedDate = time.format('DD-MM-YY HH:mm')
    return {
      ...acc,
      [roundedDate]: [{
        date: time,
        roundedDate: roundedDate,
        volume: 0,
        price: closePrice,
        timestamp: time.unix() * 1000,
      }]
    }
  }, {})
}

const getDecimals = async (address) => {
  const abi = {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{name: '', type: 'uint8'}],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
  const res = await readContract({
    address: address,
    abi: [abi],
    functionName: 'decimals',
  }).catch(error => {
    console.log(error)
  })
  return res
}

export const orderBookFormatter = async (list, baseCurrency, quoteCurrency) => {
  const baseDecimals = await getDecimals(baseCurrency)
  const quoteDecimals = await getDecimals(quoteCurrency)
  return Object.entries(list).reduce((acc, [side, values]) => {
    let prevVolume = 0
    return {
      ...acc,
      [side]: values.slice(0, 10).map((row) => {
        const volume = formatUnits(row.quantity, baseDecimals)
        prevVolume += volume*1
        return {
          priceFormatted: formatUnits(row.price, quoteDecimals),
          volume: prevVolume,
          quantity: volume,
        }
      })
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
    orderBookId: null,
    trades: {
      nfts: [],
      tokens: [],
    },
    myOrdersDialogOpen: false,
  },

  reducers: {
    tokens: (state, { payload }) => {
      state.tokens = payload
    },
    nfts: (state, { payload }) => {
      state.nfts = payload
    },
    orderBook: (state, { payload }) => {
      state.orderBooks[payload.type] = payload.data
      state.orderBookId = payload.tokenAddress
    },
    trades: (state, { payload }) => {
      state.trades[payload.type] = payload.data
    },
    myOrdersDialogOpen: (state, { payload }) => {
      state.myOrdersDialogOpen = payload
    },
  },
})

const getters = {
  nfts: createSelector([
    state => state.$orders.nfts,
  ], (orders) => {
    return {
      open: orders.map(order => new Order.NFT(order)),
      closed: [],
    }
  }),
  tokens: createSelector([
    state => state.$orders.tokens
  ], (orders) => {
    return {
      open: orders.map(order => new Order.TOKEN(order)).filter(order => order.status === 'open'),
      closed: orders.map(order => new Order.TOKEN(order)).filter(order => order.status === 'completed' || order.status === 'cancelled')
    }
  }),
  orderBook: (type) => createSelector([
    state => state.$orders.orderBooks[type]
  ], (orderBook) => {
    if (type === 'tokens') {
      return {
        buy: orderBook.buy,
        sell: orderBook.sell,
      }
    }
    return {
      buy: orderBook.buy.slice(0, 10).map(item => ({ ...item, priceFormatted: item.priceFormatted ?? item.price, volume: item.volume || item.quantity })),
      sell: orderBook.sell.slice(0, 10).map(item => ({ ...item, priceFormatted: item.priceFormatted ?? item.price, volume: item.volume || item.quantity })),
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
      const roundedDate = round(moment(sale.timestamp * 1000), moment.duration(interval.count, interval.unit), 'ceil')
      const intervalKey = roundedDate.unix()
      const formattedData = {
        price: sale.priceFormatted * 1,
        timestamp: sale.timestamp * 1000,
        volume: sale.amount * 1,
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
        emptyPeriods = generatePeriods(time, previousRoundedDate, previousClosePrice, { count: interval.count, unit: interval.unit })
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
      }, { timestamps: [], prices: [], volume: 0 })
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
        time: sales[0].date.unix() * 1000
      }
    })
    return result.sort((a, b) => a.time - b.time)
  }),
}

const api = {
  get: {
    tokens: ({ address, blockchain }) => {
      const network = CHAINS.find(chain => chain.code === blockchain)
      return fetch(`/api/tokens/orders/${network.id}/${address}`).then(async res => {
        const json = await res.json()
        if (json && Array.isArray(json)) {
          return json
        }
      })
      // return request(`address/${address}`, 'GET', {api: 'inch', blockchain, ...rest}).then(res => {
      //   if (res && Array.isArray(res)) {
      //     return res.map(order => ({...order, network: blockchain}))
      //   }
      //   return []
      // })
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
      return request(`limit-order`, 'POST', { api: 'inch', ...params })
    },
    tokenAPI: (params) => {
      return request('market/orders','POST', {api: 'backend', ...params})
    }
  }
}

api.get.nfts.orderBook = (params) => {
  return Promise.all([
    request('orders/depth/v1', 'GET', { side: 'buy', ...params }),
    request('orders/depth/v1', 'GET', { side: 'sell', ...params }),
  ]).then(([buy, sell]) => {
    return { buy: buy ? buy.depth : [], sell: sell ? sell.depth : [] }
  })
}

api.get.tokens.orderBook = async ({ address, ...rest }) => {
  const network = CHAINS.find(chain => chain.code === rest.blockchain)
  if (network.useBackend) {
    const res = await request('market/orderbook/depth', 'GET', {api: 'backend', chain_id: network.id, base_asset: address, quote_asset: network.usdtContract})
    if (res.error) {
      return {buy: [], sell: []}
    }
    const sides = {Asks: 'sell', Bids: 'buy'}
    const temp = Object.entries(res).reduce((acc, [side, values]) => ({
      ...acc,
      [sides[side]]: values ?? []
    }), {})
    return await orderBookFormatter(temp, address, network.usdtContract)
  }
  const res = await fetch(`/api/tokens/order-book/${network.id}/${network.usdtContract}/${address}`)
  const json = await res.json()
  return json
}

api.get.tokens.trades = ({ address, blockchain, ...rest }) => {
  const network = CHAINS.find(chain => chain.code === blockchain)
  return fetch(`/api/tokens/sales/${network.id}/${network.usdtContract}/${address}`).then(async res => {
    return await res.json()
  })
}

api.get.tokens.byAssets = ({ makerAsset, takerAsset, blockchain, ...rest }) => {
  return request('all', 'GET', { api: 'inch', takerAsset: takerAsset, makerAsset: makerAsset, blockchain, ...rest })
}

export default {
  reducer: ordersSlice.reducer,
  set: ordersSlice.actions,
  get: getters,
  api: api,
}
