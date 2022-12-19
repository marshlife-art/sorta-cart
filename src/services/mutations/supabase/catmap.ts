import { supabase } from '../../../lib/supabaseClient'
import { SupaCatmap } from '../../../types/SupaTypes'
import { DeleteCatmap, UpsertCatmap } from '../types'

export const upsertCatmap: UpsertCatmap = async (catmap: SupaCatmap[]) => {
  const { error, count } = await supabase.from('catmap').upsert(catmap, {
    count: 'exact',
    ignoreDuplicates: true
  })
  return { error, count }
}

export const deleteCatmap: DeleteCatmap = async (from: string) => {
  const { error } = await supabase.from('catmap').delete().eq('from', from)

  return { error }
}
