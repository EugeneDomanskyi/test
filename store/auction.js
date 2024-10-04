import { createSelector, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { formatUnits } from 'viem'

import { request } from './index'
import Decimal from 'decimal.js'

import TelegramBot from '@/libs/TelegramBot'

const template = (item) => {
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

  const userIdentifier = auction.last_bidder.user_identifier
  const lastBidderWallet = (userIdentifier.startsWith('0x') ? userIdentifier.toLowerCase() : userIdentifier) || null
  const marketPrice = Number(item.auction_value)
  const startPrice = formatUnits(auction.start_price.toString(), auction.auction_token.decimals)
  const currentPrice = formatUnits((auction.last_bid_price > 0 ? auction.last_bid_price : auction.start_price).toString(), auction.auction_token.decimals)
  const nextPrice = new Decimal(Number(currentPrice) + (auction.last_bid_price > 0 ? Number(formatUnits(auction.minimum_bid_price_increment, auction.auction_token.decimals)) : 0)).toDecimalPlaces(auction.auction_token.decimals).toFixed()
  const discount = marketPrice > 0 ? Math.round((marketPrice - currentPrice) / marketPrice * 100) : 0
  const priceLimit = auction.auction_amount_limit != '' ? formatUnits(auction.auction_amount_limit.toString(), auction.auction_token.decimals) : 0

  const isBiddable = (priceLimit > 0 && currentPrice < priceLimit) || priceLimit == 0

  const tgUser = TelegramBot.getUsername()
  let isLastBidderMe = tgUser ? lastBidderWallet == tgUser : false
  const isCurrent = isLastBidderMe
  let claimTime = 0
  let isClaimable = false
  
  if (status == 'closed' && auction.claim_tx_hash == '') {
    claimTime = moment(auction.last_bid_timestamp * 1000).add(3 * 24 * 60 * 60, 'seconds')
    const diff = claimTime.diff(now) < 0 ? 0 : claimTime.diff(now)
    isClaimable = diff > 0
  }

  return {
    id: auction.id,
    productId: auction.product.id,
    image: auction.s3_url || null,
    logo: auction.product.collection_url || null,
    status: status,
    current: isCurrent,
    wallet: lastBidderWallet,
    startPrice,
    marketPrice: marketPrice.toFixed(2),
    currentPrice,
    nextPrice,
    priceLimit,
    isBiddable,
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
    history: auctionHistoryTemplate(item),
    bidsCount: item?.total_bids ?? 0,
    claimContract: auction.auction_amount_receiver,
    txHash: auction.tx_hash,
    claimHash: auction.claim_tx_hash,
    claimTime,
    isClaimable,
    updated: false,
  }
}

const auctionHistoryTemplate = (item) => {
  const auction = item?.auction ? item.auction : item.auction_id

  let history = []
  if (auction?.bid_histories && item?.bid_history_user_info) {
    history = auction.bid_histories.map(bid => {
      return {
        bid: `${formatUnits(bid.price.toString(), auction.auction_token.decimals)} ${auction.auction_token.symbol.toUpperCase()}`,
        wallet: item.bid_history_user_info[bid.wallet_id].user,
        date: moment(bid.created_at).format('HH:mm DD-MM-YYYY'),
        time: moment(bid.created_at).format('HH:mm'),
        day: moment(bid.created_at).format('DD-MM-YYYY'),
        created_at: bid.created_at,
      }
    })
  }

  return history
}

export const earnings_template_v2 = (item) => {
  return {
    id: item.id,
    name: item.product_title,
    endsAt: moment(item.last_bid_timestamp * 1000).valueOf(),
    currentPrice: formatUnits(item.last_bid_price.toString(), item.decimals),
    currency: item.auction_token_currency,
    txHash: item.claim_tx_hash,
    claimHash: item.claim_tx_hash,
    claimTime: moment(item.last_bid_timestamp * 1000).add(3 * 24 * 60 * 60, 'seconds'),
  }
}

const bid_history_template_v2 = (item, token) => {
  return {
    bid: `${formatUnits(item.price.toString(), token.decimals)} ${token.symbol.toUpperCase()}`,
    user: item.user_details,
    date: moment(item.timestamp).format('HH:mm DD-MM-YYYY'),
    time: moment(item.timestamp).format('HH:mm'),
    day: moment(item.timestamp).format('DD-MM-YYYY'),
    created_at: item.timestamp,
  }
}

export const auctionSlice = createSlice({
  name: '$auction',

  initialState: {
    all: [],
    claim: false,
    claimId: null,
    current: null,
    auctionWarning: false,
    showTelegramSubscription: null,
    auctionBannerVisible: false,
    loading: true,
    showUpcoming: false,
    auctionHistory: [],
    bid_history: [],
    bid_page: {
      current: 1,
      limit: 5,
      total: 0,
    },
    debug: [],
    earnings: [],
    earnings_page: {
      current: 1,
      limit: 5,
      total: 0,
    },
    earnings_unclaimed: 0,
  },

  reducers: {
    loading: (state, { payload }) => {
      state.loading = payload
    },

    all: (state, { payload }) => {
      state.all = payload.map(item => template(item))
    },

    update: (state, { payload }) => {
      state.all = state.all.map(item => {
        if (Number(item.id) == Number(payload.auction.id)) {
          const auction = template(payload)
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

      if (state.current?.id == payload.auction.id) {
        const auction = template(payload)
        if ((auction.status == 'ongoing' && auction.currentPrice >= state.current.currentPrice) || auction.status != 'ongoing') {
          state.current = {
            ...auction,
            updated: true,
          }
        }
      }
    },

    auctionNotUpdated: (state, { payload }) => {
      state.all = state.all.map(item => {
        if (item.id == payload.id) {
          return {
            ...payload,
            updated: false,
          }
        }

        return item
      })
    },

    auctionNotClaim: (state, { payload }) => {
      state.all = state.all.map(item => {
        if (item.id == payload.id) {
          return {
            ...payload,
            isClaimable: false,
            claimTime: 0,
          }
        }

        return item
      })

      if (state.current?.id && state.current.id == payload.id) {
        state.current.isClaimable = false
        state.current.claimTime = false
      }
    },

    auctionsCheckCurrent: (state, { payload }) => {
      state.all = state.all.map(item => {
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
      state.all = state.all.map(item => {
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
      state.current = payload
    },

    auctionHistory: (state, { payload }) => {
      state.auctionHistory = auctionHistoryTemplate(payload)
    },

    auctionWarning: (state, { payload }) => {
      state.auctionWarning = payload
    },

    claim: (state, { payload }) => {
      state.claim = payload
    },

    claimId: (state, { payload }) => {
      state.claimId = payload
    },

    showUpcoming: (state, { payload }) => {
      state.showUpcoming = payload
    },

    showTelegramSubscription: (state, { payload }) => {
      state.showTelegramSubscription = payload
    },

    auctionBannerVisible: (state, { payload }) => {
      state.auctionBannerVisible = payload
    },

    earnings: (state, { payload }) => {
      const temp = payload.map(item => template(item))
      const now = moment()
      temp.sort((a, b) => {
        if (a.claimHash === '' && b.claimHash !== '') return -1
        if (a.claimHash !== '' && b.claimHash === '') return 1
        if (a.claimHash === '' && b.claimHash === '') {
          const aClaimTime = moment(a.claimTime)
          const bClaimTime = moment(b.claimTime)

          if (aClaimTime.isBefore(now) && bClaimTime.isSameOrAfter(now)) return 1
          if (aClaimTime.isSameOrAfter(now) && bClaimTime.isBefore(now)) return -1

          return aClaimTime.diff(bClaimTime)
        }

        return b.startsIn - a.startsIn
      })
      state.earnings = temp
    },

    earnings_v2: (state, { payload }) => {
      state.earnings = payload.map(item => earnings_template_v2(item))
    },

    earnings_unclaimed_v2: (state, { payload }) => {
      state.earnings_unclaimed = payload
    },

    earnings_page_v2: (state, { payload }) => {
      state.earnings_page = payload
    },

    bid_history_v2: (state, { payload }) => {
      state.bid_history = payload.map(item => bid_history_template_v2(item, state.current.token))
    },

    bid_history_v2: (state, { payload }) => {
      state.bid_history_page = payload
    },

    debug: (state, { payload }) => {
      state.debug = [...state.debug, payload]
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

  bidPrice: createSelector([
    state => state.$gem.auctions,
    state => state.$gem.loading,
    state => state.$gem.current,
  ], (auctions, loading, current) => {
    let price = 100
    if (!loading) {
      if (current) {
        price = current.gemsPrice
      } else {
        if (auctions.length) {
          const ongoing = auctions.find(item => item.status == 'ongoing')
          if (ongoing) {
            price = ongoing.gemsPrice
          } else {
            const upcomings = auctions.filter(item => item.status == 'upcoming')
            if (upcomings.length) {
              upcomings.sort((a, b) => a.startsIn - b.startsIn)
              price = upcomings[0].gemsPrice
            }
          }
        }
      }
    }

    return price
  }),

  ongoingAuction: createSelector([
    state => state.$auction.all,
    state => state.$auction.showUpcoming,
  ], (auctions, showUpcoming) => {
    if (showUpcoming) {
      const upcomingAuctions = auctions.filter(item => item.status == 'upcoming')
      if (upcomingAuctions.length) {
        upcomingAuctions.sort((a, b) => a.startsIn - b.startsIn)
        return upcomingAuctions[0]
      }
    }

    const ongoingAuctions = auctions.filter(item => item.status == 'ongoing')
    if (ongoingAuctions.length) {
      ongoingAuctions.sort((a, b) => a.startsIn - b.startsIn)
      return ongoingAuctions[0]
    } else {
      const closedAuctions = auctions.filter(item => item.status == 'closed')
      if (closedAuctions.length) {
        closedAuctions.sort((a, b) => b.startsIn - a.startsIn)
        return closedAuctions[0]
      }
    }
    return null
  }),

  upcomingAuction: createSelector([
    state => state.$auction.all,
  ], (auctions) => {
    const upcomingAuctions = auctions.filter(item => item.status == 'upcoming')
    
    if (upcomingAuctions.length) {
      upcomingAuctions.sort((a, b) => a.startsIn - b.startsIn)
      console.log('upcomingAuctions', upcomingAuctions[0]);
      return upcomingAuctions[0]
    }
    return null
  }),

  earningToBeClaimedCount: createSelector([
    state => state.$auction.earnings,
  ], (earnings) => {
    return earnings.filter(item => item.claimHash == '' && moment(item.claimTime).diff(moment()) > 0).length
  }),
}

export const api = {
  all: () => {
    return request(`auctions`, 'GET', {api: 'bid'})
  },
  
  allTelegram: () => {
    console.log('FETCH allTelegram');
    return request(`telegram/auctions`, 'GET', {api: 'bid'})
  },

  get: (id) => {
    return request(`auction/${id}`, 'GET', {api: 'bid'})
  },

  getTelegram: (id) => {
    console.log('FETCH getTelegram BY ID', id);
    return request(`telegram/auction/${id}`, 'GET', {api: 'bid'})
  },

  earnings: () => {
    return request(`telegram/auctions/won`, 'GET', {api: 'bid'})
  },

  earnings_v2: (params) => {
    return request(`telegram/auctions/won`, 'GET', {api: 'bid_v2', ...params})
  },

  bid_history_v2: (id, params) => {
    return request(`telegram/auction/${id}/bid-histories`, 'GET', {api: 'bid_v2', ...params})
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

  txHash: (params) => {
    return request(`telegram/auction/claim/save-tx`, 'POST', {api: 'bid', ...params})
  },

  claim: (params) => {
    return request(`auction/claim`, 'POST', {api: 'bid', ...params})
  },
  
  upload: (data) => {
    return request(`upload/image`, 'POST', {api: 'admin'}, data)
  },
}

export default {
  reducer: auctionSlice.reducer,
  set: auctionSlice.actions,
  api,
  get,
}