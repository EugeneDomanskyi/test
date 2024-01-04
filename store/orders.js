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
    time: moment(item.time).format('DD MMM, HH:mm'),
    timeMoment: moment(item.time),
  }
}

export const ordersSlice = createSlice({
  name: '$orders',

  initialState: {
    list: [],
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
    
    orderbook: (state, { payload }) => {
      const sides = {Asks: 'sell', Bids: 'buy'}
      const list = Object.entries(payload.data).reduce((acc, [side, values]) => ({
        ...acc,
        [sides[side]]: values ?? []
      }), {})
      
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
      state.trades = payload.data.map((trade) => ({
        ...trade,
        priceFormatted: trade.price,
        orderInvalidReason: 'order filled',
        timestamp: new Date(trade.timestamp).getTime()/1000,
      }))
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
  orderbook: (params) => {
    return request('market/orderbook/depth', 'GET', {api: 'backend', ...params})
  },

  trades: (params) => {
    return request('market/trades', 'GET', {api: 'backend', ...params})
  },

  list: (params) => {
    return request('market/orders/user', 'GET', {api: 'backend', ...params})
  },

  typedData: (params) => {
    return request('market/orders/typedData/generate', 'POST', {api: 'backend', ...params})
  },

  place: (params) => {
    return request('market/orders', 'POST', {api: 'backend', ...params})
  },

  cancel: (params) => {
    return request(`market/orders/cancel`, 'POST', { api: 'backend', ...params })
  },

  cancelAll: (params) => {
    return request(`market/orders/cancel/${params.wallet}`, 'POST', { api: 'backend', ...params })
  },
}

export default {
  reducer: ordersSlice.reducer,
  set: ordersSlice.actions,
  get,
  api,
}
