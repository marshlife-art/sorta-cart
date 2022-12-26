import { SquareImportFetcher, SquareImportsFetcher } from '../types'

export const squareImportsFetcher: SquareImportsFetcher = async () => {
  return { data: [], error: null, count: 0 }
}

export const squareImportFetcher: SquareImportFetcher = async (id: string) => {
  return { data: null, error: null }
}
