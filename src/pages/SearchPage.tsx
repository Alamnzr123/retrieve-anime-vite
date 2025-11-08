import { useEffect, useState, useRef } from 'react'
import { Input, Box, Grid, Image, Text, Button, Spinner, Stack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../storeHooks.ts'
import type { RootState } from '../store'
import { setQuery, fetchSearch, setPage } from '../domain/store/searchSlice'
import { Link } from 'react-router-dom'
import useDebouncedValue from '../hooks/useDebouncedValue'

export default function SearchPage() {
  const dispatch = useAppDispatch()
  const { query, results, loading, error, page, hasMore } = useAppSelector((s: RootState) => s.search)
  const [term, setTerm] = useState<string>(query)
  const debounced = useDebouncedValue(term, 250)
  const [localError, setLocalError] = useState<string | null>(null)
  type UnwrapablePromise = { unwrap?: () => Promise<unknown>; abort?: () => void }

  // track the pending thunk promise so we can abort it if a new request starts
  type Abortable = { abort?: () => void }
  const pendingRef = useRef<Abortable | null>(null)

  useEffect(() => {
    if (!debounced || debounced.length < 1) return

    // cancel previous in-flight thunk
    if (pendingRef.current && typeof pendingRef.current.abort === 'function') {
      try {
        pendingRef.current.abort!()
      } catch (e) {
        console.debug('[SearchPage] abort previous pending thunk failed', e)
      }
    }

    console.debug('[SearchPage] dispatching search', debounced, page)
    // dispatch the thunk and unwrap to catch rejections locally
  const pending = dispatch(fetchSearch({ query: debounced, page })) as UnwrapablePromise
  pendingRef.current = pending

    // when the thunk resolves or rejects we want to handle errors locally
    pending
      .unwrap?.()
      .then(() => {
        // clear any local error on success
        setLocalError(null)
      })
      .catch((e: unknown) => {
        // If the error is an AbortError (fetch was cancelled), ignore it
        const isObject = typeof e === 'object' && e !== null
        const name = isObject ? (e as { name?: string }).name : undefined
        const message = isObject ? (e as { message?: unknown }).message : undefined
        const isAbort = name === 'AbortError' || message === 'cancelled'
        if (isAbort) {
          // do not set an error for user-initiated cancellation
          console.debug('[SearchPage] search aborted')
          return
        }

        // For other errors, set a local error message so the UI can display it
        const msg = message ? String(message) : String(e ?? 'Unknown error')
        console.error('[SearchPage] search failed', e)
        setLocalError(msg)
      })

    return () => {
      if (pendingRef.current && typeof pendingRef.current.abort === 'function') {
        try {
          pendingRef.current.abort!()
        } catch (e) {
          console.debug('[SearchPage] abort on unmount failed', e)
        }
      }
    }
  }, [debounced, page, dispatch])

  useEffect(() => {
    console.debug('[SearchPage] results updated', results)
  }, [results])

  useEffect(() => {
    // when term cleared, reset results
    if (term === '') dispatch(setQuery(''))
  }, [term, dispatch])

  function next() {
    if (!hasMore) return
    dispatch(setPage(page + 1))
  }

  function prev() {
    if (page <= 1) return
    dispatch(setPage(page - 1))
  }

  return (
    <Box>
  <Input value={term} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTerm(e.target.value)} placeholder="Search anime..." />

      <Box mt={4}>
        {loading && (
          <Stack>
            <Spinner />
            <Text>Loading...</Text>
          </Stack>
        )}

        {!loading && results.length === 0 && <Text>No results. Try another query.</Text>}

        {error && <Text color="red.500">{error}</Text>}
        {localError && <Text color="red.500">{localError}</Text>}

        <Grid templateColumns="repeat(auto-fill, minmax(140px, 1fr))" gap={4} mt={4}>
          {(results ?? []).map((r: { mal_id: number; image_url: string; title: string }) => (
            <Box key={r.mal_id} borderWidth={1} borderRadius="md" p={2}>
              <Link to={`/anime/${r.mal_id}`}>
                <Image src={r.image_url} alt={r.title} boxSize="160px" objectFit="cover" />
                <Text mt={2} fontSize="sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.title}
                </Text>
              </Link>
            </Box>
          ))}
        </Grid>

        <Box mt={4} display="flex" gap={2}>
          <Button onClick={prev} disabled={page <= 1}>
            Prev
          </Button>
          <Button onClick={next} disabled={!hasMore}>
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
