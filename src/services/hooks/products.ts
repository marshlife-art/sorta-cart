import useSWR from 'swr'
import {
  productsFetcher,
  distinctProductVendors,
  distinctProductImportTags,
  productsAutocompleteFetcher
} from '../fetchers'

export function useProducts() {
  const { data, error } = useSWR('products', productsFetcher)

  return {
    products: data,
    isLoading: !error && !data,
    isError: error
  }
}

export function useDistinctProductVendors() {
  const { data, error } = useSWR<string[]>(
    'distinct_product_vendors',
    distinctProductVendors
  )

  return {
    vendorLookup: data,
    isLoading: !error && !data,
    isError: error
  }
}

export function useDistinctProductImportTags() {
  const { data, error } = useSWR<string[]>(
    'distinct_product_import_tags',
    distinctProductImportTags
  )

  return {
    importTagsLookup: data,
    isLoading: !error && !data,
    isError: error
  }
}

export function useProductsAutocomplete(q: string) {
  const { data, error } = useSWR(
    { key: 'lineitem_autocomplete', q },
    productsAutocompleteFetcher
  )

  return {
    products: data,
    isLoading: !error && !data,
    isError: error
  }
}
