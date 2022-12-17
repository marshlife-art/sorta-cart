import { SupaOrderLineItem } from '../../../types/SupaTypes'
import { InsertOrderLineItem, UpdateOrderLineItems } from '../types'

export const updateOrderLineItems: UpdateOrderLineItems = async (
  orderLineItems: Partial<SupaOrderLineItem>,
  ids: number[]
) => {
  // #TODO

  return { error: null, status: 200 }
}

export const insertOrderLineItem: InsertOrderLineItem = async (
  lineItem: Partial<SupaOrderLineItem>
) => {
  // #TODO
  return { data: null, error: null }
}
