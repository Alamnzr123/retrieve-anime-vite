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

  // track the pending thunk promise so we can abort it if a new request starts
  type Abortable = { abort?: () => void }
  const pendingRef = useRef<Abortable | null>(null)

  useEffect(() => {
    if (!debounced || debounced.length < 1) return

    // cancel previous in-flight thunk
    if (pendingRef.current && typeof pendingRef.current.abort === 'function') {
      try {
        pendingRef.current.abort!()
      } catch {
        // ignore abort errors
      }
    }

  console.debug('[SearchPage] dispatching search', debounced, page)
  const pending = dispatch(fetchSearch({ query: debounced, page }))
    pendingRef.current = pending

    return () => {
      if (pendingRef.current && typeof pendingRef.current.abort === 'function') {
        try {
          pendingRef.current.abort!()
        } catch {
          // ignore
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
