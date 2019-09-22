import {
  ProductMapFn,
  ProductPropMapFn,
  ProductMap,
  ProductMeta
} from '../types/Product'
import { PaymentStatus, ShipmentStatus } from '../types/Order'

// #TODO: dynamically get this from relevant PouchDB data
const PRODUCT_MAP: ProductMap = {
  name: [0],
  description: [1],
  pk: [2],
  size: [3],
  unit_type: [4],
  price: [5],
  unit_price: [6],
  property: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
  category: [10],
  search: [0, 1, 10]
}

export const PRODUCT_KEYS: Array<keyof ProductMap> = [
  'name',
  'description',
  'pk',
  'size',
  'unit_type',
  'price',
  'unit_price',
  'property',
  'category',
  'search'
]

export const productPropMapFn: ProductPropMapFn = (
  row: string[],
  productMap?: ProductMap
): string[] => {
  productMap = productMap || PRODUCT_MAP
  return productMap['property'].map((idx: number) => row[idx])
}

export const productMapFn: ProductMapFn = (
  key: keyof ProductMap,
  row: string[],
  productMap?: ProductMap
): string => {
  productMap = productMap || PRODUCT_MAP
  return productMap[key].map((idx: number) => row[idx]).join(' ')
}

export const ORDER_PAYMENT_STATUSES: PaymentStatus[] = [
  'balance_due',
  'credit_owed',
  'failed',
  'paid',
  'void'
]

export const ORDER_SHIPMENT_STATUSES: ShipmentStatus[] = [
  'backorder',
  'canceled',
  'partial',
  'pending',
  'ready',
  'shipped'
]

export function dateMinSec(): string {
  const date = new Date()
  return `${date.getMinutes()}${date.getSeconds()}`
}

export function catz(catIdx: number, data?: string[][]): ProductMeta['catz'] {
  let ret: ProductMeta['catz'] = []
  try {
    if (data) {
      ret = data
        .map((p: string[]) => productMapFn('category', p))
        .filter(
          (cat: string, index: number, arr: string[]) =>
            arr.indexOf(cat) === index && cat !== ''
        )
        .map(name => ({
          name: name,
          count: data.filter(p => p[catIdx] === name).length
        }))
    }
  } catch (e) {
    console.warn('meOW! catz caught error:', e)
  } finally {
    return ret
  }
}

export function tryGetDateTime(id: string) {
  try {
    return new Date(parseInt(id)).toLocaleString()
  } catch (e) {
    console.warn('tryGetDateTime caught error:', e)
    return ''
  }
}
