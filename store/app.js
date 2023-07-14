import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: '$app',

  initialState: {
    blockchain: 'polygon',
  },

  reducers: {
    blockchain: (state, { payload }) => {
      state.blockchain = payload
    },
  },
})

export default {
  reducer: appSlice.reducer,
  set: appSlice.actions,
}