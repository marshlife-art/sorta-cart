import {
  DeleteProducts,
  UpdateNoBackorder,
  UpdateProducts,
  UpsertProducts
} from '../types'

import { SupaProduct } from '../../../types/SupaTypes'
import { supabase } from '../../../lib/supabaseClient'

export const updateNoBackorder: UpdateNoBackorder = async (
  prevImportTag: string,
  column?: 'import_tag' | 'vendor'
) => {
  const column_or_default = column ? column : 'import_tag'
  const { error } = await supabase
    .from('products')
    .update({ no_backorder: true })
    .eq(column_or_default, prevImportTag)
  return { error }
}

export const upsertProducts: UpsertProducts = async (
  products: SupaProduct[],
  ignoreDuplicates: boolean
) => {
  const { error, count } = await supabase.from('products').upsert(products, {
    count: 'exact',
    ignoreDuplicates
  })
  return { error, count }
}

export const deleteProducts: DeleteProducts = async (ids: string[]) => {
  const { error } = await supabase.from('products').delete().in('id', ids)

  return { error }
}

export const updateProducts: UpdateProducts = async (
  product: Partial<SupaProduct>,
  ids: string[]
) => {
  const { error } = await supabase
    .from('products')
    .update(product)
    .in('id', ids)

  return { error }
}
