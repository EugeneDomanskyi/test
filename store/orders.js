import { createSlice, createSelector } from '@reduxjs/toolkit'
import { formatUnits } from 'viem'
import moment from 'moment'

import { request } from './index'

export const template = (item) => {
  let status = 'unknown'
  switch (item.status) {
    case 'Active': 
      status = 'open'
      break
    case 'Matched':
    case 'Completed':
    case 'Filled':
      status = 'completed'
      break
    case 'Cancelled':
      status = 'cancelled'
      break
  }

  return {
    ...item,
    id: item.orderId,
    status,
    itemPrice: item.price / item.quantity,
    time: moment(item.time).format('DD MMM, HH:mm'),
    timeMoment: moment(item.time),
  }
}

export const ordersSlice = createSlice({
  name: '$orders',

  initialState: {
    list: [],
    interval: {
      key: '4h',
      count: 4,
      unit: 'hours',
      seconds: 4 * 60 * 60,
    },
    chart: [],
    orderbook: {
      buy: [],
      sell: [],
    },
    trades: [],
    myOrdersDialogOpen: false,
  },

  reducers: {
    list: (state, { payload }) => {
      state.list = payload.map(item => template(item))
    },

    add: (state, { payload }) => {
      state.list = [template(payload), ...state.list]
    },

    update: (state, { payload }) => {
      state.list = state.list.map(o => o.id === payload.orderId ? template(payload) : o)
    },

    interval: (state, {payload}) => {
      state.interval = payload
    },

    chart: (state, { payload }) => {
      state.chart = payload.sort((a, b) => a.time - b.time)
    },
    
    orderbook: (state, { payload }) => {
      const sides = {Asks: 'sell', Bids: 'buy'}
      const list = Object.entries(payload.data).reduce((acc, [side, values]) => ({
        ...acc,
        [sides[side]]: values ?? []
      }), {})
      
      list.buy.sort((a, b) => b.price * 1 - a.price * 1)
      list.sell.sort((a, b) => a.price * 1 - b.price * 1)

      state.orderbook = Object.entries(list).reduce((acc, [side, values]) => {
        let prevVolume = 0
        return {
          ...acc,
          [side]: values.slice(0, 10).map((row) => {
            const volume = formatUnits(row.quantity, payload.token.decimals)
            prevVolume += volume * 1

            return {
              priceFormatted: formatUnits(row.price, payload.token.quoteDecimals),
              volume: prevVolume,
              quantity: volume,
            }
          })
        }
      }, {})
    },

    trades: (state, { payload }) => {
      state.trades = payload.data
    },

    addTrades: (state, { payload }) => {
      state.trades = [payload, ...state.trades]
    },

    updateTrade: (state, { payload }) => {
      state.trades = state.trades.map(tr => (tr.id === payload.id ? payload : tr))
    },

    myOrdersDialogOpen: (state, { payload }) => {
      state.myOrdersDialogOpen = payload
    },
  },
})

const get = {
  list: createSelector([
    state => state.$orders.list
  ], (orders) => {
    return {
      open: orders.filter(order => order.status === 'open'),
      closed: orders.filter(order => order.status === 'completed' || order.status === 'cancelled')
    }
  }),
}

const api = {
  chart: (params) => {
    return request(`market/chart`, 'GET', params)
  },

  orderbook: (params) => {
    return request('market/orderbook/depth', 'GET', params)
  },

  trades: (params) => {
    return request('market/trades', 'GET', params)
  },

  list: (params) => {
    const { user_address, ...query } = params
    return request(`market/orders/user/${user_address}`, 'GET', query)
  },

  typedData: (params) => {
    return request('market/orders/typedData/generate', 'POST', params)
  },

  place: (params) => {
    return request('market/orders', 'POST', params)
  },

  cancel: (params) => {
    return request(`market/orders/cancel/${params.id}`, 'POST', params)
  },

  cancelAll: (params) => {
    return request(`market/orders/cancelAll`, 'POST', params)
  },

  details: (params) => {
    return request(`market/orders/trades/${params.id}`)
  },
}

export default {
  reducer: ordersSlice.reducer,
  set: ordersSlice.actions,
  get,
  api,
}
