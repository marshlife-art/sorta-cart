import { SupaCatmap } from '../../../types/SupaTypes'
import { DeleteCatmap, UpsertCatmap } from '../types'

export const upsertCatmap: UpsertCatmap = async (catmap: SupaCatmap[]) => {
  // #TODO
  return { error: null, count: null }
}

export const deleteCatmap: DeleteCatmap = async (from: string) => {
  // #TODO
  return { error: null }
}
