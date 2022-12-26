import { supabase } from '../../../lib/supabaseClient'
import { SupaSquareImport } from '../../../types/SupaTypes'
import { SquareImportsFetcher, SquareImportFetcher } from '../types'

export const squareImportsFetcher: SquareImportsFetcher = async () => {
  const { data, error, count } = await supabase
    .from('squareImport')
    .select('*', { count: 'exact' })

  if (!error && data?.length) {
    return { data, error, count }
  }

  return { data: [], error, count }
}

export const squareImportFetcher: SquareImportFetcher = async (id: string) => {
  const { data, error } = await supabase
    .from('squareImport')
    .select()
    .eq('id', id)
    .single()

  return { data, error }
}
