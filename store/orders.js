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
      const temp = [{"orderId":"7956df63-160a-42bc-be51-ac6f5b34d3c6","orderHash":"7e17707550084d648ef5c51e72d54d3094c4ebfe8c63bcb19259cb6489b4f63e","side":"sell","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":4,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-21T16:20:39.528889Z"},{"orderId":"2d1ddf27-4925-4abb-8304-ea2c69294df3","orderHash":"d6308554ccc4e1f1b49da8f09643c235c2d51f932b18b5a73345490259d5226a","side":"buy","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":1,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T19:15:59.34834Z"},{"orderId":"9737f771-ef72-4f0c-a422-006f9e819a44","orderHash":"0ae261439cf257df538b9d15fce592e5e9de39df8dac69eaaa95ffd2bc468fc7","side":"sell","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":4,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T19:01:54.65805Z"},{"orderId":"72334afe-28f1-4dc2-8a47-2624650f399e","orderHash":"a711b19ee390f04ebba501519d2cd01e020b4d2f67c0b9e98479bf5ee1ed2c08","side":"sell","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":4,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:59:46.439347Z"},{"orderId":"ca27805d-875f-4958-bc2e-35ff8c609ae7","orderHash":"daaa2258aa1a8611f214529860ffa4f6a73e8febd0227a26713789e3d7d93cbf","side":"sell","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":1,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:59:42.435959Z"},{"orderId":"9df84e40-f71e-4413-b588-e924fb956fa5","orderHash":"87d9a5adbb160a772f92bccc9e61ba506fb5a91a4c571b1c5deb6e1c122bada4","side":"sell","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":3,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:59:30.386038Z"},{"orderId":"3f72d556-876b-4b5d-8fba-c363a6f74cc5","orderHash":"6224830e323364b6827b2a95c4dc7b8726c7156b59b4367abeeeb1ef753b8434","side":"sell","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":7,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:59:19.378088Z"},{"orderId":"6e15351b-dfbc-4d14-8193-79858004698c","orderHash":"4a798618a44b1abd927e6a3a419bda8e70003ec0c0383278830836821d0f58f6","side":"buy","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":9,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:59:11.409801Z"},{"orderId":"a3e565da-88ad-4229-bed6-eb86142f6c36","orderHash":"ae7e2e70a002ed23ce8e58daf00e240c9105032e615330869aef3f69118f624e","side":"buy","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":4,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:59:10.45724Z"},{"orderId":"dd87d818-3378-400e-95d2-d5ad51779e12","orderHash":"e2c8aa75a639bfa5832b94bc2409047b58ceda29114a82cf75a8acafb5c1b6a3","side":"sell","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":9,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:58:52.389142Z"},{"orderId":"919210e9-72c5-4ef7-9bfb-92dc2cd4e322","orderHash":"e4698e680166d237164251bea7874067adea6c10c4e696c7110b31ad87eb0221","side":"sell","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":9,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:57:49.316349Z"},{"orderId":"35ebe898-4c3a-40ea-9fa3-8787d9a62267","orderHash":"4a59234ac9b37cbc181b9d2458e30f58e41559a068599a020e5027c989c02aca","side":"sell","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":6,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:57:11.290744Z"},{"orderId":"72c2398c-c8a4-4686-99db-add42a9e95a6","orderHash":"9cf598987768c6d6d1ac6151f6d15d0530214fcde61d3e02f213442bffa37f55","side":"buy","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":3,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:55:47.226633Z"},{"orderId":"930d5036-f027-49e4-abc9-283b201c6aa1","orderHash":"babb1470a4ad3808390127b757f5ebee03741b65981ae7067a875060479af6bb","side":"buy","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":1,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:55:42.222747Z"},{"orderId":"dfa438e4-35f1-4b3a-86a0-f84ebf0a3dc5","orderHash":"f1f9637cc3c2cdf1e83a947be942c1da9d78c0d5356e9aaff4ffd702ec80dfad","side":"buy","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":8,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:54:46.191139Z"},{"orderId":"ad84eeca-b376-4b2f-9aba-5fe8f8b2f65d","orderHash":"6131f8e104a8b837d58bbb5d8bdbbc314ee4007f021c079f9102aa2878db450f","side":"buy","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":6,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:54:27.221355Z"},{"orderId":"b35a4ba0-1612-48f8-b475-aa8ae6ff944f","orderHash":"e2ca5b2f8ba1fa7129722d7da009c6f169d2764022c274f95544f4936b23fd6b","side":"buy","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":4,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:54:14.176137Z"},{"orderId":"df7f21af-e2d4-4333-bb5c-d965f175fc34","orderHash":"59dd1aaa81c01ba1d6d86244a2cce1a6bcfbd354d85bea74cf19260774355ed4","side":"buy","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":5,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:54:11.170873Z"},{"orderId":"011ef338-6684-40e5-8df0-2918b28aa141","orderHash":"60b039ce8d415a2caf7a14f52136a3f737e8f99821060bdc87ed25276987e0cd","side":"sell","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":5,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:53:56.184382Z"},{"orderId":"3479878f-78e7-414e-9ca1-ae5c0d519d6b","orderHash":"90d56ad644012d34081e2fdf6bb70c548ee9bb6decfd05002c536f82537c0db2","side":"buy","baseCurrency":"KRYPTONITE","quoteCurrency":"USDT","contractAddress":"0x6464e14854d58feb60e130873329d77fcd2d8eb7","quantity":6,"quantityFilled":0,"price":0,"status":"Active","time":"2024-01-19T18:53:53.171309Z"}]
      state.list = temp.map(item => template(item))
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
