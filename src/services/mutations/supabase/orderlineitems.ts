import { supabase } from '../../../lib/supabaseClient'
import { Json } from '../../../types/supabase'
import { SupaOrderLineItem } from '../../../types/SupaTypes'
import { InsertOrderLineItem, UpdateOrderLineItems } from '../types'

export const updateOrderLineItems: UpdateOrderLineItems = async (
  orderLineItems: Partial<SupaOrderLineItem>,
  ids: number[]
) => {
  const { error, status } = await supabase
    .from('OrderLineItems')
    .update({
      ...orderLineItems,
      data: orderLineItems.data as Json
    })
    .in('id', ids)

  return { error, status }
}

export const insertOrderLineItem: InsertOrderLineItem = async (
  lineItem: Partial<SupaOrderLineItem>
) => {
  const { data, error } = await supabase.from('OrderLineItems').insert({
    ...lineItem,
    data: lineItem.data as Json
  })

  return { data, error }
}
