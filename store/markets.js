import { createSlice } from '@reduxjs/toolkit'

export const marketsSlice = createSlice({
  name: '$markets',

  initialState: {
    loading: true,
  },

  reducers: {
    loading: (state, { payload }) => {
      state.loading = payload
    },
  },
})

const api = {
  strapi: async (address, token) => {
    const res = await fetch('https://strapi.tegro.com/api/markets/?filters[contract_address][$eq]=' + address, {method: 'GET', headers: {Authorization: `Bearer ${token}`}})
    const json = await res.json()
    return json
  },
}

export default {
  reducer: marketsSlice.reducer,
  set: marketsSlice.actions,
  api,
}