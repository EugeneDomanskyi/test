import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { formatUnits } from 'viem'

import { request } from './index'

const auctionTemplate = (item, wallet) => {
  const now = moment()
  const startsAt = moment(item.starts_at * 1000)

  const status = item.status == 1 ? 'upcoming' : item.status == 2 ? 'ongoing' : 'closed'
  let time = 0
  if (status == 'ongoing') {
    if (item.last_bid_timestamp > 0) {
      const lastBid = moment(item.last_bid_timestamp * 1000)
      time = lastBid.add(item.reset_timer, 'seconds').diff(now, 'seconds')
      time = time < 0 ? 0 : time
    }
  }

  // let status = now.isAfter(startsAt) ? 'ongoing' : 'upcoming'
  // if (status == 'ongoing') {
  //   if (item.last_bid_timestamp > 0) {
  //     const lastBid = moment(item.last_bid_timestamp * 1000)
  //     status = now.isAfter(lastBid.add(item.reset_timer, 'seconds')) ? 'closed' : 'ongoing'

  //     time = lastBid.add(item.reset_timer, 'seconds').diff(now)
  //   }
  // }

  const lastBidderWallet = item.last_bidder.wallet_address.toLowerCase() || null

  const marketPrice = formatUnits(item.start_price.toString(), 6)
  const currentPrice = formatUnits((item.last_bid_price > 0 ? item.last_bid_price : item.start_price).toString(), 6)

  return {
    id: item.id,
    productId: item.product.id,
    image: item.s3_url || null,
    logo: item.product.collection_url || null,
    status: status,
    current: wallet == lastBidderWallet,
    wallet: lastBidderWallet,
    marketPrice,
    currentPrice,
    currency: 'USDC',
    name: item.product.title,
    time: time * 1000,
    startsIn: moment(item.starts_at * 1000).valueOf(),
    pointsPrice: item.points_to_deduct,
  }
}

export const gemSlice = createSlice({
  name: '$gem',

  initialState: {
    referral: {
      id: 0,
      gems: 0,
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
      gems_earned_today: 0,
    },

    tournaments: {},
    auctions: [],
    current: null,
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
      const gems_earned_today = payload.total_user_points

      state.liquidity = {
        open,
        completed,
        total_open_orders,
        total_open_amount,
        total_liquidity,
        gems_earned_today,
      }
    },

    tournaments: (state, { payload }) => {
      state.tournaments = payload.reduce((acc, value) => {
        const key = value.title.toLowerCase().replace(/ /g, '_')
        const now = moment()
        const startTime = moment(value.start_time)
        const endTime = moment(value.end_time)

        value.status = 'on-going'
        if (now.isBefore(startTime)) {
          value.status = 'upcoming'
        }

        if (now.isAfter(endTime)) {
          value.status = 'closed'
        }

        const limit = Math.min(10, value.rewards.length)
        if (value.leaderboard.length <= limit) {
          for (let i = 0; i < limit; i++) {
            if (!value.leaderboard[i]) {
              value.leaderboard.push({
                points: '-',
                points_percentage: 0,
                position: i + 1,
                reward: value.rewards[i].reward,
                reward_currency: value.rewards[i].reward_currency,
                wallet_address: '-',
              })
            }
          }
        }

        if (value.rewards.length) {
          value.currency = value.rewards[0].reward_currency
        }

        switch (key) {
          case 'brett':
            value.name = 'BRETT Brawl'
            break
          case 'toshi':
            value.name = 'Toshi Mania'
            break
          case 'brett_brawl_s2':
            value.name = 'Brett Brawl S2'
            break
          case 'poncho_rush_s1':
            value.name = 'Poncho Rush S1'
            break
          default:
            value.name = value.alias
            break
        }

        value.expand = false

        return {
          ...acc,
          [key]: value,
        }
      }, {})
    },

    tournamentStatus: (state, { payload }) => {
      state.tournaments[payload.key].status = payload.status
    },

    tournamentExpand: (state, { payload }) => {
      state.tournaments[payload].expand = !state.tournaments[payload].expand
    },

    auctions: (state, { payload }) => {
      state.auctions = payload.data.map(item => auctionTemplate(item, payload.wallet))
    },

    current: (state, { payload }) => {
      state.current = auctionTemplate(payload.data, payload.wallet)
    },

    jwt: (state, { payload }) => {
      state.jwt = payload
    },

    showBrett: (state, { payload }) => {
      state.showBrett = payload
    },

    clear: (state, { payload }) => {
      state.jwt = null
      state.referral = {
        id: 0,
        gems: 0,
        referral_code: '',
        referrals_count: 0,
      }
  
      state.stats = {}
  
      state.history = []
      state.referrals = []
      state.transactions = []
  
      state.liquidity = {
        open: [],
        completed: [],
        total_open_orders: 0,
        total_open_amount: 0,
        total_liquidity: 0,
        gems_earned_today: 0,
      }
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

  stats: (wallet, params) => {
    return request(`user/${wallet}/points-stats`, 'GET', {api: 'accounts', ...params})
  },

  liquidity: (wallet, params) => {
    return request(`user/${wallet}/order-liquidity`, 'GET', {api: 'accounts', ...params})
  },

  addGems: (wallet, params) => {
    return request(`user/${wallet}/add-points`, 'POST', {api: 'accounts', ...params})
  },
  
  auctions: () => {
    return request(`auctions`, 'GET', {api: 'bid'})
  },

  auction: (id) => {
    return request(`auction/${id}`, 'GET', {api: 'bid'})
  },

  login: (params) => {
    return request(`login`, 'POST', {api: 'bid', ...params})
  },

  bid: (params) => {
    return request(`place`, 'POST', {api: 'bid', ...params})
  },

  clear: (id) => {
    return request(`auction/clear/${id}`, 'POST', {api: 'bid'})
  },
  
  tournament: (alias) => {
    return request(`tournament/${alias}`, 'GET', {api: 'exchange'})
  },

  tournaments: () => {
    return request(`tournament/list`, 'GET', {api: 'exchange'})
  },
}

export default {
  reducer: gemSlice.reducer,
  set: gemSlice.actions,
  api,
}