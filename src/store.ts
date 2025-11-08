import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './domain/store/searchSlice'
import detailReducer from './domain/store/detailSlice'

export const store = configureStore({
  reducer: {
    search: searchReducer,
    detail: detailReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
