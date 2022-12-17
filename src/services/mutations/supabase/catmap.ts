import { supabase } from '../../../lib/supabaseClient'
import { SupaCatmap } from '../../../types/SupaTypes'
import { DeleteCatmap, UpsertCatmap } from '../types'

export const upsertCatmap: UpsertCatmap = async (catmap: SupaCatmap[]) => {
  const { error, count } = await supabase
    .from<SupaCatmap>('products')
    .upsert(catmap, {
      count: 'exact',
      returning: 'minimal',
      ignoreDuplicates: true
    })
  return { error, count }
}

export const deleteCatmap: DeleteCatmap = async (from: string) => {
  const { error } = await supabase
    .from<SupaCatmap>('catmap')
    .delete({ returning: 'minimal' })
    .eq('from', from)

  return { error }
}
