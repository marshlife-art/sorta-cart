import { supabase } from '../../../lib/supabaseClient'
import { SupaCatmap } from '../../../types/SupaTypes'
import { CatmapFetcher } from '../types'

export const catmapFetcher: CatmapFetcher = async () => {
  const { data, error, count } = await supabase
    .from<SupaCatmap>('catmap')
    .select('*', { count: 'exact' })

  if (!error && data?.length) {
    return { data, error, count }
  }

  return { data: [], error, count }
}
