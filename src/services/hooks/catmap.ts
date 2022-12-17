import useSWR from 'swr'
import { catmapFetcher } from '../fetchers'

export function useCatmap() {
  const { data, error, mutate } = useSWR('catmap', catmapFetcher)

  return {
    catmap: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}
