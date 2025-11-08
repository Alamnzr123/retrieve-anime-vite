import { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Box, Image, Heading, Text, Spinner, Flex, Button, HStack, Badge, Wrap, WrapItem } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from '../storeHooks.ts'
import { fetchDetail } from '../domain/store/detailSlice'
import type { RootState } from '../store'

export default function DetailPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((s: RootState) => s.detail)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    dispatch(fetchDetail(Number(id)))
  }, [id, dispatch])

  if (loading) return <Spinner />
  if (error) return <Text color="red.500">{error}</Text>
  if (!data) return <Text>No detail found.</Text>

  type Detail = {
    title?: string
    title_japanese?: string
    synopsis?: string
    episodes?: number
    rating?: string
    images?: { jpg?: { image_url?: string } }
    score?: number
    type?: string
    status?: string
    aired?: { string?: string }
    studios?: Array<{ name?: string }>
    genres?: Array<{ name?: string }>
  }

  const d = data as Detail


  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Box>
          <Text fontSize="sm" color="gray.500">
            <Link to="/">Home</Link> / <Text as="span" fontWeight="semibold">{d.title ?? 'Detail'}</Text>
          </Text>
        </Box>

        <Box>
          <Button size="sm" onClick={() => navigate(-1)}>← Back</Button>
        </Box>
      </HStack>

      <Heading>{d.title}</Heading>
      {d.title_japanese && <Text fontSize="sm">{d.title_japanese}</Text>}

  <Box mt={2}>
        <Wrap align="center">
          {d.type && (
            <WrapItem>
              <Badge colorScheme="purple">{d.type}</Badge>
            </WrapItem>
          )}
          {typeof d.score === 'number' && (
            <WrapItem>
              <Badge colorScheme="yellow">Score: {d.score}</Badge>
            </WrapItem>
          )}
          {d.status && (
            <WrapItem>
              <Badge colorScheme="green">{d.status}</Badge>
            </WrapItem>
          )}
        </Wrap>

        <Wrap mt={2}>
          {(d.studios ?? []).map((s, i) => (
            <WrapItem key={i}>
              <Badge>{s.name}</Badge>
            </WrapItem>
          ))}
          {(d.genres ?? []).map((g, i) => (
            <WrapItem key={`g-${i}`}>
              <Badge colorScheme="teal">{g.name}</Badge>
            </WrapItem>
          ))}
        </Wrap>
      </Box>

      <Flex mt={4} gap={6} flexDirection={["column", "row"]}>
        <Box>
          {d.images?.jpg?.image_url && (
            <Image src={d.images!.jpg!.image_url} alt={d.title} boxSize="300px" objectFit="cover" />
          )}
        </Box>

        <Box flex={1}>
          <Text fontSize="md" mb={4}>{d.synopsis}</Text>

          <Box mb={2}>
            <Text fontWeight="bold">Episodes</Text>
            <Text>{d.episodes ?? 'N/A'}</Text>
          </Box>

          <Box>
            <Text fontWeight="bold">Rating</Text>
            <Text>{d.rating ?? 'N/A'}</Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
