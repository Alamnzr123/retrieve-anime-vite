import axios from 'axios'

export interface JikanPagination {
  last_visible_page: number
  has_next_page: boolean
}

export interface JikanAnimeImagesJpg {
  image_url?: string
}

export interface JikanAnimeImages {
  jpg?: JikanAnimeImagesJpg
}

export interface JikanAnimeItem {
  mal_id: number
  title: string
  images?: JikanAnimeImages
  synopsis?: string
}

export async function searchAnime(query: string, page = 1, signal?: AbortSignal) {
  const resp = await axios.get('https://api.jikan.moe/v4/anime', {
    params: { q: query, page, limit: 12 },
    signal,
  })
  return resp
}

export async function getAnimeDetail(id: number, signal?: AbortSignal) {
  const resp = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`, { signal })
  return resp
}
