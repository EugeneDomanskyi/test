import { createSelector, createSlice } from '@reduxjs/toolkit'
import { gql } from '@apollo/client'

import { request } from './index'

export const raffleSlice = createSlice({
  name: '$raffle',

  initialState: {
    fetching: false,
    all: [],
    current: {},
    loading: false,
    loadingUser: true,
    sort: 'status:asc',
    filter: 'All',
    search: '',
    page: 1,
    user: {
      id: null,
      totalEarned: 0,
      totalTKeysSpent: 0,
      campaignParticipated: [],
    },
    last: [],
    balance: 0,
    tokenIds: [],
    participants: [],
  },

  reducers: {
    fetching: (state, { payload }) => {
      state.fetching = payload
    },

    loading: (state, { payload }) => {
      state.loading = payload
    },

    all: (state, { payload }) => {
      state.all = payload
    },

    current: (state, { payload }) => {
      state.current = payload
    },

    sort: (state, { payload }) => {
      state.sort = payload
    },

    filter: (state, { payload }) => {
      state.filter = payload
    },

    search: (state, { payload }) => {
      state.search = payload
    },

    page: (state, { payload }) => {
      state.page = payload
    },

    user: (state, { payload }) => {
      state.user = payload
    },

    last: (state, { payload }) => {
      state.last = payload
    },

    balance: (state, { payload }) => {
      state.balance = payload
    },

    tokenIds: (state, { payload }) => {
      state.tokenIds = payload
    },

    loadingUser: (state, { payload }) => {
      state.loadingUser = payload
    },

    update: (state, { payload }) => {
      state.all = state.all.map(item => {
        const participated = payload.find(el => el.campaignId == item.id)
        if (participated) {
          return {
            ...item,
            user: participated,
          }
        } else {
          return item
        }
      })
    },

    participants: (state, { payload }) => {
      state.participants = payload.map(item => {
        return {
          ...item,
          tKeysCount: item.tokenIds.length,
          rewardAmount: item.rewardAmount / Math.pow(10, 6),
          status: item.isResolved ? 'Success' : (!item.isResolved ? 'Processing' : 'Failed')
        }
      })

      state.all = state.all.map(item => {
        const participated = payload.find(el => el.campaign.id == item.id)
        if (participated) {
          return {
            ...item,
            user: participated,
          }
        } else {
          return item
        }
      })

      const rawAmount = state.participants.reduce((acc, item) => {
        return acc + item.rewardAmount
      }, 0)

      state.user.totalEarned = Math.round(rawAmount * Math.pow(10, 6))/Math.pow(10, 6)
    },

    reset: (state) => {
      state.user = {
        id: null,
        totalEarned: 0,
        totalTKeysSpent: 0,
        campaignParticipated: [],
      }

      state.balance = 0
      state.tokenIds = []
      state.participants = []
      state.all = state.all.map(item => {
        delete item.user
        return item
      })
    }
  },
})

const get = {
  filtered: createSelector([
    (state) => state.$raffle.all,
    (state) => state.$raffle.search,
    (state) => state.$raffle.sort,
    (state) => state.$raffle.filter,
  ], (all, search, sort, filter) => {
    const filtered = all.filter(item => {
      return filter != 'All' ? item.status == filter : true
    })

    const searched = filtered.filter(item => {
      return item.title.toLowerCase().includes(search.trim().toLowerCase())
    })

    const [sortBy, sortDirection] = sort.split(':')
    const statusOrder = {
      Active: 1,
      Upcoming: 2,
      Closed: 3,
    }
    searched.sort((a, b) => {
      if (sortBy == 'status') {
        const statusComparison = statusOrder[a.status] - statusOrder[b.status]
        if (statusComparison !== 0) {
          return statusComparison
        }
        
        if (a.user && !b.user) return -1
        if (!a.user && b.user) return 1
        return 0
      }

      return sortDirection == 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
    })

    return searched
  }),

  campaign: createSelector([
    (state) => state.$raffle.all,
  ], (all) => {
    return (id) => all.find(item => item.id == id)
  }),
}

const api = {
  ipfs: (hash) => {
    return request(`https://${hash}.ipfs.w3s.link/info.json`, 'GET', {api: 'remote'})
  },

  reward: (hash) => {
    // const url = 'https://us-central1-vibrant-waters-399406.cloudfunctions.net/rewards-status'     // dev endpoint
    const url = 'https://us-central1-vibrant-waters-399406.cloudfunctions.net/rewards-status-polygon'
    return request(`${url}?transactions[]=${hash}`, 'GET', {api: 'remote'})
  },
}

const query = {
  campaigns: gql`
    query campaigns($skip: Int) {
      campaigns(skip: $skip, where: {id_not_in: [0, 1, 3]}) {
        id
        ipfsHash
        rewardAmount
        totalTransferred
        tKeyRequired
        status
        startTimestamp
        endTimestamp
        rewardRange {
          id
          range
          reward
        }
      }
    }
  `,

  campaign: gql`
    query campaign($id: String) {
      campaign(id: $id) {
        id
        ipfsHash
        rewardAmount
        totalTransferred
        tKeyRequired
        status
        startTimestamp
        endTimestamp
        rewardRange {
          id
          range
          reward
        }
      }
    }
  `,

  user: gql`
    query user($id: String) {
      user(id: $id) {
        id
        totalEarned
        totalTKeysSpent
        campaignParticipated {
          id
        }
      }
    }
  `,

  userCampaignParticipants: gql`
    query userCampaignParticipants($id: String) {
      userCampaignParticipants(where: {and: [{user_: {id: $id}}, {campaign_: {id_not_in: [0, 1]}}]}, orderBy: participatedTimestamp, orderDirection: desc) {
        id
        isResolved
        rewardAmount
        tokenIds
        resolvedTransaction
        resolvedTimestamp
        participatedTransaction
        participatedTimestamp
        campaign {
          id
        }
      }
    }
  `,

  last: gql`
    query userCampaignParticipants {
      userCampaignParticipants(orderBy: resolvedTimestamp, orderDirection: desc, where: {and: [{isResolved: true}, {campaign_: {id_not_in: [0, 1]}}]}) {
        id
        rewardAmount
        participatedTransaction
        resolvedTransaction
        user {
          id
        }
      }
    }
  `,
}

export default {
  reducer: raffleSlice.reducer,
  set: raffleSlice.actions,
  api,
  get,
  query,
}