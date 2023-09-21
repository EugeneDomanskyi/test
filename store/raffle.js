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
    sort: 'status:asc',
    search: '',
    page: 1,
    user: {
      id: null,
      totalEarned: 0,
      totalTKeysSpent: 0,
      campaignParticipated: [],
    },
    last: [],
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
  },
})

const get = {
  filtered: createSelector([
    (state) => state.$raffle.all,
    (state) => state.$raffle.search,
    (state) => state.$raffle.sort,
  ], (all, search, sort) => {
    const searched = all.filter(item => {
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
        return statusOrder[a.status] - statusOrder[b.status]
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
  }
}

const query = {
  campaigns: gql`
    query campaigns($skip: Int) {
      campaigns(skip: $skip, where: {id_not: 0}) {
        id
        ipfsHash
        rewardAmount
        totalTransferred
        tKeyRequired
        status
        startTimestamp
        endTimestamp
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

  userCampaigns: gql`
    query userCampaigns($id: String) {
      userCampaigns(where: {user_: {id: $id}}) {
        id
        campaignId
        tKeysSpent
        totalEarned
        user {
          campaignParticipated(first: 1, orderBy: participatedTimestamp, orderDirection: desc) {
            isResolved
          }
        }
      }
    }
  `,

  last: gql`
    query userCampaignParticipants {
      userCampaignParticipants(orderBy: resolvedTimestamp, orderDirection: desc, first: 6, where: {isResolved: true}) {
        id
        rewardAmount
        transaction
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