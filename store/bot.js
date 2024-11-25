import { createSelector, createSlice } from '@reduxjs/toolkit'

import { request } from './index'

export const botSlice = createSlice({
  name: '$bot',

  initialState: {
    user: null,
    tab: 'auctions',
    tabHistory: [],
    onboard: null,
    outbid: false,
    outbidClosed: false,
    megaModal: false,
    products: [],
    invoices: [],
  },

  reducers: {
    user: (state, { payload }) => {
      // payload.points = 0
      state.user = payload
    },

    balance: (state, { payload }) => {
      state.user = {
        ...state.user,
        points: payload,
      }
    },

    tab: (state, { payload }) => {
      state.tab = payload
      state.tabHistory = [...state.tabHistory, payload]
    },

    onboard: (state, { payload }) => {
      // state.onboard = payload
      state.onboard = null
    },

    outbid: (state, { payload }) => {
      state.outbid = payload
    },

    outbidClosed: (state, { payload }) => {
      state.outbidClosed = payload
    },

    megaModal: (state, { payload }) => {
      state.megaModal = payload
    },

    back: (state) => {
      const newHistory = [...state.tabHistory]
      state.tab = newHistory.pop()
      state.tabHistory = newHistory
    },

    products: (state, { payload }) => {
      state.products = payload.map(item => {
        return {
          id: item.id,
          active: item.active,
          position: item.position * 1,
          title: item.title,
          className: item.color,
          gems: item.gems.toLocaleString('en-US'),
          price: item.price,
          priceOld: item.price_old,
          currency: item.price_currency.toUpperCase(),
          image: item.image,
          discount: item.description,
          offer: item.restriction === 'one_time',
        }
      })
    },

    invoices: (state, { payload }) => {
      state.invoices = payload
    },
  },
})

const get = {
  activeProducts: createSelector([
    state => state.$bot.products,
  ], (products) => {
    const newProducts = [...products].sort((a, b) => a.position - b.position)
    return newProducts.filter(item => item.active && !item.offer)
  }),

  offer: createSelector([
    state => state.$bot.products,
  ], (products) => {
    const newProducts = [...products].sort((a, b) => a.position - b.position)
    return newProducts.find(item => item.offer && item.active)
  }),
}

const api = {
  invoice: (params) => {
    return request(`telegram/generate-invoice`, 'POST', {api: 'accounts', ...params})
  },

  user: (params) => {
    return request(`telegram/create`, 'POST', {api: 'accounts', ...params})
  },

  transaction: (params) => {
    return request(`telegram/transaction/add`, 'POST', {api: 'accounts', ...params})
  },

  bid: (params) => {
    return request(`place-via-telegram`, 'POST', {api: 'bid', ...params})
  },

  generateWalletHash: (params) => {
    return request(`telegram/hash/generate`, 'GET', {api: 'accounts', ...params})
  },

  assignWalletToUser: (params) => {
    return request(`telegram/assign`, 'POST', {api: 'accounts', ...params})
  },

  unassign: () => {
    return request(`telegram/unassign`, 'DELETE', {api: 'accounts'})
  },

  claim: (params) => {
    return request(`telegram/claim/task`, 'POST', {api: 'accounts', ...params})
  },

  products: () => {
    return request(`products`, 'GET', {api: 'accounts'})
  },
}

export default {
  reducer: botSlice.reducer,
  set: botSlice.actions,
  get,
  api,
}