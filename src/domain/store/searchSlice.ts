import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { JikanAnimeItem } from '../../infrastructure/jikanClient'
import { searchAnime } from '../../infrastructure/jikanClient'

export interface AnimeItem {
  mal_id: number
  title: string
  image_url: string
  synopsis?: string
}

interface SearchState {
  query: string
  page: number
  results: AnimeItem[]
  loading: boolean
  error?: string | null
  hasMore: boolean
}

const initialState: SearchState = {
  query: '',
  page: 1,
  results: [],
  loading: false,
  error: null,
  hasMore: false,
}

export const fetchSearch = createAsyncThunk<
  { results: AnimeItem[]; hasMore: boolean },
  { query: string; page: number },
  { rejectValue: string }
>('search/fetch', async ({ query, page }, { signal, rejectWithValue }) => {
  try {
    console.debug('[searchSlice] fetchSearch started', { query, page })
    const resp = await searchAnime(query, page, signal)
    const data = resp.data
    console.debug('[searchSlice] api response', { data })
    const items = Array.isArray(data?.data) ? (data.data as JikanAnimeItem[]) : []
    const results: AnimeItem[] = items.map((item) => ({
      mal_id: item.mal_id,
      title: item.title,
      image_url: item.images?.jpg?.image_url ?? '',
      synopsis: item.synopsis,
    }))
    const pagination = data.pagination || {}
    const hasMore = !!pagination.has_next_page
    return { results, hasMore }
  } catch (err: unknown) {
    const e = err as Error
    console.error('[searchSlice] fetch error', e)
    return rejectWithValue(e?.message ?? 'Unknown error')
  }
})

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
      state.page = 1
      state.results = []
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    clear(state) {
      state.query = ''
      state.page = 1
      state.results = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearch.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.results = action.payload.results
        state.hasMore = action.payload.hasMore
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.loading = false
        if (action.payload === 'cancelled') return
        state.error = action.payload ?? 'Failed to fetch'
      })
  },
})

export const { setQuery, setPage, clear } = slice.actions
export default slice.reducer
