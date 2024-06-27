import { createSlice, createSelector } from '@reduxjs/toolkit'
import { formatUnits, parseUnits } from 'viem'
import moment from 'moment'

import { request } from './index'
import Decimal from 'decimal.js'

export const template = (item) => {
  // let status = 'unknown'
  // switch (item.status) {
  //   case 'active':
  //   case 'active_under_settlement':
  //     status = 'open'
  //     break
    // 'completed'
    // 'partially_completed'
    // 'partially_completed_cancelled'
    // 'cancelled'
    // 'cancelled_by_system'
    // case 'Active':
    //   status = 'open'
    //   break
    // case 'Matched':
    // case 'Completed':
    // case 'Filled':
    //   status = 'completed'
    //   break
    // case 'Partial':
    //   status = 'partial'
    //   break
    // case 'Cancelled':
    //   status = 'cancelled'
    //   break
  // }

  // if (status == 'cancelled' && item.quantityFilled > 0) {
  //   status = 'partial'
  // }

  return {
    ...item,
    id: item.order_id,
    time: moment(item.time).format('DD MMM, HH:mm'),
    timeMoment: moment(item.time),
  }
}

export const ordersSlice = createSlice({
  name: '$orders',

  initialState: {
    list: [],
    loading: true,
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

    loading: (state, { payload }) => {
      state.loading = payload
    },

    add: (state, { payload }) => {
      const exist = state.list.find(o => o.id === payload.order_id)
      if (exist) {
        state.list = state.list.map(o => o.id === payload.order_id ? template(payload) : o)
        return
      }
      state.list = [template(payload), ...state.list]
    },

    update: (state, { payload }) => {
      state.list = state.list.map(o => o.id === payload.order_id ? template(payload) : o)
    },

    updateOrderStatus: (state, { payload }) => {
      state.list = state.list.map(o => o.id in payload ? {...o, status: payload[o.id]} : o)
    },

    interval: (state, {payload}) => {
      state.interval = payload
    },

    chart: (state, { payload }) => {
      state.chart = payload.sort((a, b) => a.time - b.time).map(item => ({...item, time: item.time*1000}))
    },

    orderbook: (state, { payload }) => {
      const sides = {asks: 'sell', bids: 'buy'}
      const list = Object.entries(payload.data).reduce((acc, [side, values]) => ({
        ...acc,
        [sides[side]]: values ?? []
      }), {})

      state.orderbook = {
        buy: list.buy,
        sell: list.sell,
      }
    },

    orderbookUpdate: (state, { payload }) => {
      const updatedBuy = payload.bids.reduce((acc, item) => ({...acc, [item.price]: item.quantity}), {})
      const updatedSell = payload.asks.reduce((acc, item) => ({...acc, [item.price]: item.quantity}), {})
      const buyObj = state.orderbook.buy.reduce((acc, item) => ({...acc, [item.price]: item.quantity}), {})
      const sellObj = state.orderbook.sell.reduce((acc, item) => ({...acc, [item.price]: item.quantity}), {})
      const buy = {...buyObj, ...updatedBuy}
      const sell = {...sellObj, ...updatedSell}
      state.orderbook = {
        buy: Object.entries(buy).reduce((acc, [price, quantity]) => [...acc, {price, quantity}], []),
        sell: Object.entries(sell).reduce((acc, [price, quantity]) => [...acc, {price, quantity}], []),
      }
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
    state => state.$orders.list,
  ], (orders) => {
    return {
      open: orders.filter(order => order.status === 'open' || order.quantity_pending > 0),
      closed: orders.filter(order => order.status !== 'open' && order.quantity_pending == 0),
    }
  }),
  orderbook: createSelector([
    state => state.$orders.orderbook,
    state => state.$token.current,
  ], (orderbook, current) => {
    let sorted = {
      buy: structuredClone(orderbook.buy),
      sell: structuredClone(orderbook.sell),
    }

    if (sorted?.buy && sorted?.sell) {
      sorted.buy.sort((a, b) => b.price * 1 - a.price * 1)
      sorted.sell.sort((a, b) => a.price * 1 - b.price * 1)

      return Object.entries(sorted).reduce((acc, [side, values]) => {
        let prevVolume = 0
        return {
          ...acc,
          [side]: values.filter(item => item.quantity * 1).slice(0, 10).map((row) => {
            prevVolume += row.quantity * 1
            return {
              priceFormatted: row.price,
              price: row.price,
              volume: new Decimal(prevVolume).toDecimalPlaces(current.basePrecision).toFixed(),
              quantity: row.quantity,
            }
          })
        }
      }, {})
    }

    return {buy: [], sell: []}
  }),
}

const api = {
  chart: (params) => {
    return request(`${params.chain_id}/market/chart`, 'GET', {api: 'exchange', ...params})
  },

  orderbook: (params) => {
    return request('depth', 'GET', {api: 'orderbook', ...params})
  },

  trades: (params) => {
    return request(`${params.chain_id}/market/trades`, 'GET', {api: 'exchange', ...params})
  },

  list: (params) => {
    const { user_address, ...query } = params
    const active = request(`market/orders/user/${user_address}`, 'GET', {...query, statuses: 'active'})
    const close = request(`market/orders/user/${user_address}`, 'GET', {...query, statuses: 'matched,completed,cancelled'})
    return Promise.all([active, close]).then(([active, close]) => [...active, ...close])
  },

  typedData: (params) => {
    return request('market/orders/typedData/generate', 'POST', params)
  },

  place: (params) => {
    return request('market/orders/place', 'POST', params)
  },

  cancelTypedData: (params) => {
    return request(`market/orders/typedData/generateCancelOrder`, 'POST', params)
  },

  cancel: (params) => {
    return request(`market/orders/cancel`, 'POST', params)
  },

  cancelAll: (params) => {
    return request(`market/orders/cancel-all`, 'POST', params)
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
