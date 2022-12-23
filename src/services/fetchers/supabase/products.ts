import { Query } from 'material-table'
import {
  DistinctProductCategoriesFetcher,
  DistinctProductImportTagsFetcher,
  DistinctProductSubCategoriesFetcher,
  DistinctProductVendorsFetcher,
  ProductsAutocompleteFetcher,
  ProductsFetcher,
  ProductFetcher
} from '../types'
import { SupaProduct } from '../../../types/SupaTypes'
import { supabase } from '../../../lib/supabaseClient'
import { mapProductsToAutocomplete } from '../lib'

export const productFetcher: ProductFetcher = async (id: string) => {
  const { error, data } = await supabase
    .from('products')
    .select('id')
    .eq('id', id)
    .single()
  // #TODO: ugh, this `as SupaProduct` doesn't make sense :/
  return { data: data as SupaProduct, error }
}

export const productsFetcher: ProductsFetcher = async (
  q: Query<SupaProduct>
) => {
  let query = supabase.from('products').select('*', { count: 'exact' })

  if (q.filters.length) {
    q.filters.forEach((filter) => {
      if (filter.column.field === 'no_backorder') {
        query = query.or(`no_backorder.eq.${filter.value === 'checked'}`)
      } else if (filter.column.field === 'featured') {
        query = query.or(`featured.eq.${filter.value === 'checked'}`)
      } else if (filter.column.field === 'count_on_hand') {
        const or = `count_on_hand.${
          filter.value === 'checked' ? 'gt.0' : 'is.null,count_on_hand.lte.0'
        }`
        query = query.or(or)
      } else if (filter.column.field && filter.value) {
        if (filter.value instanceof Array && filter.value.length) {
          const or = filter.value
            .map((v) => `${String(filter.column.field)}.eq."${v}"`)
            .join(',')
          query = query.or(or)
        } else if (filter.value.length) {
          query = query.or(
            `${String(filter.column.field)}.eq."${filter.value}"`
          )
        }
      }
    })
  }
  if (q.search) {
    // #todo consider q.search.split(' ')
    query = query.or(
      ['name', 'description', 'id']
        .map((f) => `${f}.ilike."%${q.search}%"`)
        .join(',')
    )
  }
  if (q.page) {
    query = query.range(q.pageSize * q.page, q.pageSize * q.page + q.pageSize)
  }
  if (q.pageSize) {
    query = query.limit(q.pageSize)
  }
  if (q.orderBy && q.orderBy.field) {
    // #TODO: hmm, better handling of field (need col name vs. 'string' type) to avoid `as any`?
    query = query.order(q.orderBy.field as any, {
      ascending: q.orderDirection === 'asc'
    })
  }

  const { data, error, count } = await query

  return { data, error, count }
}

export const distinctProductVendors: DistinctProductVendorsFetcher =
  async () => {
    const { data, error } = await supabase
      .rpc('distinct_product_vendors')
      .single()

    if (!error && data?.length) {
      return data?.reduce((acc, row) => {
        acc.push(row.vendor)
        return acc
      }, [] as Array<string>)
    }

    return []
  }

export const distinctProductImportTags: DistinctProductImportTagsFetcher =
  async () => {
    const { data, error } = await supabase
      .rpc('distinct_product_import_tags')
      .single()

    if (!error && data?.length) {
      return data?.reduce((acc, row) => {
        acc.push(row.import_tag)
        return acc
      }, [] as Array<string>)
    }

    return []
  }

export const distinctProductCategories: DistinctProductCategoriesFetcher =
  async () => {
    const { data, error } = await supabase
      .rpc('distinct_product_categories')
      .single()

    if (error || !data) {
      return {}
    }

    return data.reduce((acc, row) => {
      acc[row.category] = row.category
      return acc
    }, {} as Record<string, string>)
  }

export const distinctProductSubCategories: DistinctProductSubCategoriesFetcher =
  async (category: string) => {
    const { data, error } = await supabase
      .rpc('distinct_product_sub_categories', { category })
      .single()

    if (error || !data) {
      return {}
    }

    return data?.reduce((acc, row) => {
      acc[row.category] = row.category
      return acc
    }, {} as Record<string, string>)
  }

export const productsAutocompleteFetcher: ProductsAutocompleteFetcher = async ({
  q
}) => {
  if (!q) {
    return []
  }
  let query = supabase.from('products').select()

  if (q) {
    query = query.or(
      [
        'name',
        'description',
        'vendor',
        'category',
        'sub_category',
        'upc_code',
        'plu'
      ]
        .map((f) => `${f}.ilike."%${q}%"`)
        .join(',')
    )
  }

  const { data: products, error } = await query

  if (error || !products) {
    return []
  }

  return products.map(mapProductsToAutocomplete)
}
