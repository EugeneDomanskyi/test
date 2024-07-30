import { createSlice } from '@reduxjs/toolkit'

export const alertSlice = createSlice({
  name: '$alert',

  initialState: {
    messages: [],
    delay: 5000,
  },

  reducers: {
    message: (state, { payload }) => {
      state.messages = [...state.messages, {delay: state.delay, ...payload}]
    },

    success: (state, { payload }) => {
      state.messages = [...state.messages, {delay: state.delay, ...payload, type: 'success'}]
    },

    error: (state, { payload }) => {
      state.messages = [...state.messages, {delay: state.delay, ...payload, type: 'error'}]
    },

    warning: (state, { payload }) => {
      state.messages = [...state.messages, {delay: state.delay, ...payload, type: 'warning'}]
    },

    info: (state, { payload }) => {
      state.messages = [...state.messages, {delay: state.delay, ...payload, type: 'info'}]
    },

    clear: (state) => {
      state.messages = []
    },
  },
})

export default {
  reducer: alertSlice.reducer,
  set: alertSlice.actions,
}