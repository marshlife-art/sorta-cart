import { Query } from 'material-table'
import {
  DistinctProductCategoriesFetcher,
  DistinctProductImportTagsFetcher,
  DistinctProductSubCategoriesFetcher,
  DistinctProductVendorsFetcher,
  ProductFetcher,
  ProductsAutocompleteFetcher,
  ProductsFetcher
} from '../types'
import { SupaProduct } from '../../../types/SupaTypes'
import { mapProductsToAutocomplete } from '../lib'

import data from './products.json'

export const productFetcher: ProductFetcher = async (id: string) => {
  const product = data.find((p) => p.id === id) as unknown as SupaProduct
  return { data: product, error: null }
}

export const productsFetcher: ProductsFetcher = async (
  q: Query<SupaProduct>
) => {
  // #TODO: handle filtering/sorting/paginating with q
  const supadata = data as unknown as SupaProduct[]
  return { data: supadata, error: null, count: data.length }
}

export const distinctProductVendors: DistinctProductVendorsFetcher =
  async () => {
    return data.reduce((acc, product) => {
      if (!acc.includes(product.vendor)) {
        acc.push(product.vendor)
      }
      return acc
    }, [] as string[])
  }

export const distinctProductImportTags: DistinctProductImportTagsFetcher =
  async () => {
    return data.reduce((acc, product) => {
      if (!acc.includes(product.import_tag)) {
        acc.push(product.import_tag)
      }
      return acc
    }, [] as string[])
  }

type CatObj = { [index: string]: string }
export const distinctProductCategories: DistinctProductCategoriesFetcher =
  async () => {
    return data.reduce((acc, row) => {
      acc[row.category] = row.category
      return acc
    }, {} as CatObj)
  }
export const distinctProductSubCategories: DistinctProductSubCategoriesFetcher =
  async (category: string) => {
    return data
      .filter((p) => p.sub_category === category)
      .reduce((acc, row) => {
        acc[row.category] = row.category
        return acc
      }, {} as CatObj)
  }

export const productsAutocompleteFetcher: ProductsAutocompleteFetcher = async ({
  q
}) => {
  if (!q) {
    return []
  }

  const products = data.filter((p) =>
    [
      p.name,
      p.description,
      p.vendor,
      p.category,
      p.sub_category,
      p.upc_code,
      p.plu
    ].includes(q)
  ) as unknown as SupaProduct[]

  return products.map(mapProductsToAutocomplete)
}
