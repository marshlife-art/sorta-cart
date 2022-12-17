import {
  DeleteProducts,
  UpdateNoBackorder,
  UpdateProducts,
  UpsertProducts
} from '../types'

import { SupaProduct } from '../../../types/SupaTypes'

export const updateNoBackorder: UpdateNoBackorder = async (
  prevImportTag: string,
  column?: 'import_tag' | 'vendor'
) => {
  // #TODO
  return { error: null }
}

export const upsertProducts: UpsertProducts = async (
  products: SupaProduct[],
  ignoreDuplicates: boolean
) => {
  // #TODO
  return { error: null, count: products.length }
}

export const deleteProducts: DeleteProducts = async (ids: string[]) => {
  // #TODO
  return { error: null }
}

export const updateProducts: UpdateProducts = async (
  product: Partial<SupaProduct>,
  ids: string[]
) => {
  // #TODO:
  return { error: null }
}
