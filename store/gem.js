import { createSelector, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { formatUnits } from 'viem'

import { request } from './index'
import Decimal from 'decimal.js'

const auctionTemplate = (item, wallet) => {
  const auction = item?.auction ? item.auction : item.auction_id

  const now = moment()

  const status = auction.status == 1 ? 'upcoming' : auction.status == 2 ? 'ongoing' : 'closed'
  let time = 0
  if (status == 'ongoing') {
    if (auction.last_bid_timestamp > 0) {
      const lastBid = moment(auction.last_bid_timestamp * 1000)
      time = lastBid.add(auction.reset_timer, 'seconds').diff(now, 'seconds')
      time = time < 0 ? 0 : time
    }
  }

  const lastBidderWallet = auction.last_bidder.wallet_address.toLowerCase() || null

  const marketPrice = Number(item.auction_value)
  const currentPrice = formatUnits((auction.last_bid_price > 0 ? auction.last_bid_price : auction.start_price).toString(), 6)
  const nextPrice = new Decimal(Number(currentPrice) + Number(formatUnits(auction.minimum_bid_price_increment, 6))).toDecimalPlaces(6).toFixed()
  const discount = Math.round((marketPrice - currentPrice) / marketPrice * 100)

  let history = []
  if (auction?.bid_histories) {
    history = auction.bid_histories.map(bid => {
      return {
        bid: `${formatUnits(bid.price.toString(), 6)} USDC`,
        wallet: bid.wallet.wallet_address,
        date: moment(bid.created_at).format('HH:mm DD-MM-YYYY'),
        time: moment(bid.created_at).format('HH:mm'),
        day: moment(bid.created_at).format('DD-MM-YYYY'),
        created_at: bid.created_at,
      }
    })
  }

  return {
    id: auction.id,
    productId: auction.product.id,
    image: auction.s3_url || null,
    logo: auction.product.collection_url || null,
    status: status,
    current: wallet && wallet == lastBidderWallet,
    wallet: lastBidderWallet,
    marketPrice: marketPrice.toFixed(2),
    currentPrice,
    nextPrice,
    discount,
    token: {
      currency: auction.auction_token.symbol.toUpperCase(),
      decimals: auction.auction_token.decimals,
      address: auction.auction_token.string.toLowerCase(),
      name: auction.auction_token.name,
    },
    name: auction.product.title,
    time: time * 1000,
    startsIn: moment(auction.starts_at * 1000).valueOf(),
    gemsPrice: auction.points_to_deduct,
    lastBidTimestamp: auction.last_bid_timestamp,
    resetTimer: auction.reset_timer,
    history,
    claimContract: auction.auction_amount_receiver,
    claimHash: auction.claim_tx_hash,
    updated: false,
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
    currentTournament: null,
    auctions: [],
    claim: false,
    claimId: null,
    current: null,
    auctionWarning: false,
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

    totalGems: (state, { payload }) => {
      state.referral = {
        ...state.referral,
        points: payload,
      }
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
          value.currency = value.rewards[0].reward_currency ?? ''
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
            value.name = value.title
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

    currentTournament: (state, { payload }) => {
      const now = moment()
      const startTime = moment(payload.start_time)
      const endTime = moment(payload.end_time)

      let status = 'on-going'
      if (now.isBefore(startTime)) {
        status = 'upcoming'
      }

      if (now.isAfter(endTime)) {
        status = 'closed'
      }

      const temp = payload.alias.toLowerCase().split('-')
      const currency = payload.rewards[0].reward_currency ?? ''
      const code = temp[0]
      const name = payload?.title
      const slogan = (`${temp[0]} ${temp[1]}`).toUpperCase()

      state.currentTournament = {
        ...payload,
        status,
        currency,
        code,
        name,
        slogan,
      }
    },

    auctions: (state, { payload }) => {
      state.auctions = payload.data.map(item => auctionTemplate(item, payload.wallet))
    },

    auctionUpdated: (state, { payload }) => {
      state.auctions = state.auctions.map(item => {
        if (Number(item.id) == Number(payload.data.auction.id)) {
          const auction = auctionTemplate({auction: payload.data.auction, auction_value: item.marketPrice}, payload.wallet)
          if (auction.status == 'ongoing' && auction.currentPrice * 1 < item.currentPrice * 1) {
            return item
          }

          return {
            ...auction,
            updated: true,
          }
        }

        return item
      })

      if (state.current?.id == payload.data.auction.id) {
        const auction = auctionTemplate({auction: payload.data.auction, auction_value: state.current.marketPrice}, payload.wallet)
        if ((auction.status == 'ongoing' && auction.currentPrice >= state.current.currentPrice) || auction.status != 'ongoing') {
          state.current = auction
        }
      }
    },

    auctionNotUpdated: (state, { payload }) => {
      state.auctions = state.auctions.map(item => {
        if (item.id == payload.id) {
          return {
            ...payload,
            updated: false,
          }
        }

        return item
      })
    },

    auctionsCheckCurrent: (state, { payload }) => {
      state.auctions = state.auctions.map(item => {
        if (item.wallet != null && item.wallet == payload) {
          return {
            ...item,
            current: true,
          }
        }

        return item
      })

      if (state.current?.wallet != null && state.current.wallet == payload) {
        state.current.current = true
      }
    },

    auctionsUpdateTimer: (state) => {
      const now = moment()
      state.auctions = state.auctions.map(item => {
        let time = 0
        if (item.status == 'ongoing') {
          if (item.lastBidTimestamp > 0) {
            const lastBid = moment(item.lastBidTimestamp * 1000)
            time = lastBid.add(item.resetTimer, 'seconds').diff(now, 'seconds')
            time = time < 0 ? 0 : time
          }
        }

        return {
          ...item,
          time,
        }
      })
    },

    current: (state, { payload }) => {
      state.current = auctionTemplate(payload.data, payload.wallet)
    },

    jwt: (state, { payload }) => {
      state.jwt = payload
    },

    auctionWarning: (state, { payload }) => {
      state.auctionWarning = payload
    },

    showBrett: (state, { payload }) => {
      state.showBrett = payload
    },

    claim: (state, { payload }) => {
      state.claim = payload
    },

    claimId: (state, { payload }) => {
      state.claimId = payload
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

export const get = {
  claimItem: createSelector([
    state => state.$gem.auctions,
    state => state.$gem.claimId,
    state => state.$gem.current,
  ], (auctions, claimId, current) => {
    return claimId ? (auctions.length ? auctions.find(item => item.id == claimId) : current) : null
  }),
}

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
    return request(`token/price?auction_id=${id}`, 'GET', {api: 'bid'})
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

  claim: (params) => {
    return request(`auction/claim`, 'POST', {api: 'bid', ...params})
  },
  
  tournament: (alias) => {
    return request(`tournament/${alias}`, 'GET', {api: 'exchange'})
  },

  currentTournament: () => {
    return request(`tournament/current`, 'GET', {api: 'exchange'})
  },

  tournaments: () => {
    return request(`tournament/list`, 'GET', {api: 'exchange'})
  },
}

export default {
  reducer: gemSlice.reducer,
  set: gemSlice.actions,
  api,
  get,
}