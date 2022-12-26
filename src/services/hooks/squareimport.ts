import useSWR from 'swr'
import { squareImportsFetcher } from '../fetchers'

export function useSquareImports() {
  const { data, error, mutate } = useSWR('squareimports', squareImportsFetcher)

  return {
    squareImports: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}
