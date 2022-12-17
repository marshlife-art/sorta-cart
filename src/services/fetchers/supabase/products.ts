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
    .from<SupaProduct>('products')
    .select('id')
    .eq('id', id)
    .single()

  return { error, data }
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
    query = query.order(q.orderBy.field, {
      ascending: q.orderDirection === 'asc'
    })
  }

  const { data, error, count } = await query

  return { data, error, count }
}

export const distinctProductVendors: DistinctProductVendorsFetcher =
  async () => {
    const { data, error } = await supabase.rpc('distinct_product_vendors')

    if (!error && data?.length) {
      return data?.reduce((acc, row) => {
        acc.push(row.vendor)
        return acc
      }, [])
    }

    return []
  }

export const distinctProductImportTags: DistinctProductImportTagsFetcher =
  async () => {
    const { data, error } = await supabase.rpc('distinct_product_import_tags')

    if (!error && data?.length) {
      return data?.reduce((acc, row) => {
        acc.push(row.import_tag)
        return acc
      }, [])
    }

    return []
  }

export const distinctProductCategories: DistinctProductCategoriesFetcher =
  async () => {
    const { data, error } = await supabase.rpc('distinct_product_categories')

    if (error || !data) {
      return {}
    }

    return data.reduce((acc, row) => {
      acc[row.category] = row.category
      return acc
    }, {})
  }

export const distinctProductSubCategories: DistinctProductSubCategoriesFetcher =
  async (category: string) => {
    const { data, error } = await supabase.rpc(
      'distinct_product_sub_categories',
      { category }
    )

    if (error || !data) {
      return {}
    }

    return data?.reduce((acc, row) => {
      acc[row.category] = row.category
      return acc
    }, {})
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
