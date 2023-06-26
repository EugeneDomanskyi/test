
import { configureStore } from '@reduxjs/toolkit'

import $modal from './modal'
import $app from './app'

const store = configureStore({
  reducer: {
    $modal: $modal.reducer,
    $app: $app.reducer,
  },
})

export default store