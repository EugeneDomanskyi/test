import { createSlice } from '@reduxjs/toolkit'

export const modalSlice = createSlice({
  name: '$modal',

  initialState: {
    show: false,
    modal: null,
    props: {},
  },

  reducers: {
    show: (state, { payload }) => {
      state.show = true
      state.modal = payload?.modal
      state.props = payload?.props
    },

    update: (state, { payload }) => {
      state.props = { ...state.props, ...payload }
    },

    close: (state) => {
      state.show = false
    },

    destroy: (state) => {
      state.show = false
      state.modal = null
      state.props = {}
    },
  },
})

export default {
  reducer: modalSlice.reducer,
  set: modalSlice.actions,
}