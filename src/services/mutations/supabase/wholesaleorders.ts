import { supabase } from '../../../lib/supabaseClient'
import { SupaWholesaleOrder } from '../../../types/SupaTypes'
import {
  InsertWholesaleOrder,
  DeleteWholesaleOrder,
  UpsertWholesaleOrder
} from '../types'

export const insertWholesaleOrder: InsertWholesaleOrder = async (
  wholesaleOrder: Partial<SupaWholesaleOrder>
) => {
  const { data, error } = await supabase
    .from<SupaWholesaleOrder>('WholesaleOrders')
    .insert(wholesaleOrder, { returning: 'representation' })
    .single()

  return { data, error }
}

export const deleteWholesaleOrder: DeleteWholesaleOrder = async (
  id: number
) => {
  const { error } = await supabase.from('WholesaleOrders').delete().eq('id', id)

  return { error }
}

export const upsertWholesaleOrder: UpsertWholesaleOrder = async (
  wholesaleOrder: Partial<SupaWholesaleOrder>
) => {
  const { data, error } = await supabase
    .from<SupaWholesaleOrder>('WholesaleOrders')
    .upsert({
      ...wholesaleOrder,
      createdAt: undefined,
      updatedAt: new Date().toISOString(),
      OrderLineItems: undefined
    })
    .single()

  return { data, error }
}
