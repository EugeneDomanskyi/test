import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'

import { request } from './index'

const auctionTemplate = (item, wallet) => {
  const now = moment()
  const startsAt = moment(item.starts_at * 1000)

  let time = 0
  let status = now.isAfter(startsAt) ? 'ongoing' : 'upcoming'
  if (status == 'ongoing') {
    if (item.last_bid_timestamp > 0) {
      const lastBid = moment(item.last_bid_timestamp * 1000)
      status = now.isAfter(lastBid.add(item.reset_timer, 'seconds')) ? 'closed' : 'ongoing'

      time = lastBid.add(item.reset_timer, 'seconds').diff(now)
    }
  }

  const lastBidderWallet = item.last_bidder.wallet_address.toLowerCase()

  return {
    id: item.id,
    productId: item.product.id,
    image: item.product.s3_url,
    logo: null,
    status: status,
    current: wallet == lastBidderWallet,
    wallet: lastBidderWallet,
    marketPrice: item.start_price,
    currentPrice: item.last_bid_price > 0 ? item.last_bid_price : item.start_price,
    currency: 'USDC',
    name: item.product.title,
    time: time * 1000,
    startsIn: moment(item.starts_at * 1000).valueOf(),
  }
}

export const pointSlice = createSlice({
  name: '$point',

  initialState: {
    referral: {
      id: 0,
      points: 0,
      referral_code: '',
      referrals_count: 0,
    },

    stats: {},
    statsLoading: true,

    history: [],
    referrals: [],
    transactions: [],
    quests: [],
    tasks: [],
    leaderboard: [],

    liquidity: {
      open: [],
      completed: [],
      total_open_orders: 0,
      total_open_amount: 0,
      total_liquidity: 0,
      points_earned_today: 0,
    },

    auctions: [],
    tournament: {},
    showBrett: false,
  },

  reducers: {
    referral: (state, { payload }) => {
      state.referral = payload
    },

    history: (state, { payload }) => {
      state.history = payload
    },

    referrals: (state, { payload }) => {
      state.referrals = payload
    },

    transactions: (state, { payload }) => {
      state.transactions = payload
    },

    quests: (state, { payload }) => {
      state.quests = payload
    },

    tasks: (state, { payload }) => {
      state.tasks = payload
    },

    stats: (state, { payload }) => {
      state.stats = payload
    },

    statsLoading: (state, { payload }) => {
      state.statsLoading = payload
    },

    leaderboard: (state, { payload }) => {
      state.leaderboard = payload
    },

    liquidity: (state, { payload }) => {
      const open = payload.orders ? payload.orders.filter(order => order.status === 'active').sort((a, b) => new Date(b.date) - new Date(a.date)) : []
      const completed = payload.orders ? payload.orders.filter(order => order.status !== 'active').sort((a, b) => new Date(b.date) - new Date(a.date)) : []
      const total_open_orders = payload.total_open_orders
      const total_open_amount = payload.total_open_amount
      const total_liquidity = payload.total_user_amount
      const points_earned_today = payload.total_user_points

      state.liquidity = {
        open,
        completed,
        total_open_orders,
        total_open_amount,
        total_liquidity,
        points_earned_today,
      }
    },

    auctions: (state, { payload }) => {
      state.auctions = payload.data.map(item => auctionTemplate(item, payload.wallet))
    },
    
    tournament: (state, { payload }) => {
      state.tournament = payload
    },

    showBrett: (state, { payload }) => {
      state.showBrett = payload
    },
  },
})

export const api = {
  register: (params) => {
    return request(`user/create`, 'POST', {api: 'accounts', ...params})
  },

  referral: (wallet) => {
    return request(`user/${wallet}`, 'GET', {api: 'accounts'})
  },
  
  referrals: (wallet, params) => {
    return request(`user/${wallet}/referrals`, 'GET', {api: 'accounts', ...params})
  },

  history: (wallet, params) => {
    return request(`user/${wallet}/referral/transactions`, 'GET', {api: 'accounts', ...params})
  },

  transactions: (wallet, params) => {
    return request(`user/${wallet}/points/transactions`, 'GET', {api: 'accounts', ...params})
  },

  quests: (wallet, params) => {
    return request(`user/${wallet}/quests`, 'GET', {api: 'accounts', ...params})
  },

  questClaim: (wallet, params) => {
    return request(`user/${wallet}/quests/claim`, 'POST', {api: 'accounts', ...params})
  },

  tasks: (wallet, params) => {
    return request(`user/${wallet}/contributor/tasks`, 'GET', {api: 'accounts', ...params})
  },

  taskClaim: (wallet, params) => {
    return request(`user/${wallet}/contributor/tasks/claim`, 'POST', {api: 'accounts', ...params})
  },

  stats: (wallet, params) => {
    return request(`user/${wallet}/points-stats`, 'GET', {api: 'accounts', ...params})
  },

  liquidity: (wallet, params) => {
    return request(`user/${wallet}/order-liquidity`, 'GET', {api: 'accounts', ...params})
  },

  auctions: () => {
    return request(`auctions`, 'GET', {api: 'bid'})
  },
  
  tournament: (alias) => {
    return request(`tournament/${alias}`, 'GET', {api: 'exchange'})
  },
}

export default {
  reducer: pointSlice.reducer,
  set: pointSlice.actions,
  api,
}