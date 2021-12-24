import { supabase } from '../lib/supabaseClient'

export async function getCategories(): Promise<{ [index: string]: string }> {
  const { data, error } = await supabase.rpc('distinct_product_categories')

  if (error) {
    throw new Error(error.message)
  }

  // #TODO: rework this to just reduce to a string array of .category items
  return data?.reduce((acc, row) => {
    acc[row.category] = row.category
    return acc
  }, {})
}

export async function getSubCategories(category: string) {
  const { data, error } = await supabase.rpc(
    'distinct_product_sub_categories',
    { category }
  )

  if (error) {
    throw new Error(error.message)
  }

  // #TODO: rework this to just reduce to a string array of .category items
  return data?.reduce((acc, row) => {
    acc[row.category] = row.category
    return acc
  }, {})
}
