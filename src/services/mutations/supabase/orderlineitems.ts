import { supabase } from '../../../lib/supabaseClient'
import { SupaOrderLineItem } from '../../../types/SupaTypes'
import { InsertOrderLineItem, UpdateOrderLineItems } from '../types'

export const updateOrderLineItems: UpdateOrderLineItems = async (
  orderLineItems: Partial<SupaOrderLineItem>,
  ids: number[]
) => {
  const { error, status } = await supabase
    .from<SupaOrderLineItem>('OrderLineItems')
    .update(orderLineItems, { returning: 'minimal' })
    .in('id', ids)

  return { error, status }
}

export const insertOrderLineItem: InsertOrderLineItem = async (
  lineItem: Partial<SupaOrderLineItem>
) => {
  const { data, error } = await supabase.from('OrderLineItems').insert(lineItem)

  return { data, error }
}
