import { createSlice } from '@reduxjs/toolkit'

import { request } from './index'

export const raffleSlice = createSlice({
  name: '$raffle',

  initialState: {
    fetching: false,
    all: [],
    searched: [],
    current: {},
    loading: false,
    sort: 'date',
    search: '',
    searching: false,
    searchEmpty: false,
    pages: {
      history: ['init'],
      current: 'init',
    },
  },

  reducers: {
    fetching: (state, { payload }) => {
      state.fetching = payload
    },

    loading: (state, { payload }) => {
      state.loading = payload
    },

    all: (state, { payload }) => {
      state.all = payload.map(template)
    },

    searched: (state, { payload }) => {
      state.searched = payload.map(template)
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

    searching: (state, { payload }) => {
      state.searching = payload
    },

    searchEmpty: (state, { payload }) => {
      state.searchEmpty = payload
    },

    pages: (state, { payload }) => {
      const current = payload.current ?? state.pages.history.find(item => item == state.pages.current) ?? 'init'
      const currentIndex = state.pages.history.indexOf(current)
      const history = currentIndex > 0 ? state.pages.history.slice(0, currentIndex + 1) : ['init']

      if (payload.next) {
        history.push(payload.next)
      }

      state.pages = {
        current,
        history,
      }
    },

    clear: (state) => {
      state.pages = {
        current: 'init',
        history: ['init'],
      }

      state.search = ''
      state.searching = false
      state.searchEmpty = false
    },
  },
})

export default {
  reducer: raffleSlice.reducer,
  set: raffleSlice.actions,
}