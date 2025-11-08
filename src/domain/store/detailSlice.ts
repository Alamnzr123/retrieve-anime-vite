import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAnimeDetail } from '../../infrastructure/jikanClient'

interface DetailState {
  loading: boolean
  error?: string | null
  data?: unknown
}

const initialState: DetailState = { loading: false, error: null, data: null }

export const fetchDetail = createAsyncThunk<unknown, number, { rejectValue: string }>(
  'detail/fetch',
  async (id, { signal, rejectWithValue }) => {
    try {
      const resp = await getAnimeDetail(id, signal)
      // return the inner `data` object from the Jikan response
      return resp.data?.data ?? resp.data
    } catch (err: unknown) {
      const e = err as Error
      return rejectWithValue(e?.message ?? 'Failed')
    }
  },
)

const slice = createSlice({
  name: 'detail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetail.pending, (state) => {
        state.loading = true
        state.error = null
        state.data = null
      })
      .addCase(fetchDetail.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to load'
      })
  },
})

export default slice.reducer
