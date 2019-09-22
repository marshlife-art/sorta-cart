export interface ProductMap {
  name: number[]
  description: number[]
  pk: number[]
  size: number[]
  unit_type: number[]
  price: number[]
  unit_price: number[]
  property: number[]
  category: number[]
  search: number[]
}

export type ProductMapPartial = Partial<ProductMap>

export interface ProductMeta {
  data_length: number
  catz: { name: string; count: number }[]
  date_added: number // Date
  header: string[]
}

export type ProductPropMapFn = (
  row: string[],
  productMap?: ProductMap
) => string[]

export type ProductMapFn = (
  key: keyof ProductMap,
  row: string[],
  productMap?: ProductMap
) => string

export interface ProductDoc {
  _id: string
  _rev?: string
  data?: string[][]
  product_map?: ProductMap
  meta?: ProductMeta
}
