import { supabase } from '../../../lib/supabaseClient'
import {
  UpdateOrderStatus,
  UpdateOrderShipmentStatus,
  DeleteOrders
} from '../types'

export const updateOrderStatus: UpdateOrderStatus = async (
  status: string,
  ids: number[]
) => {
  const { error } = await supabase
    .from('Orders')
    .update({ status })
    .in('id', ids)
  return { error }
}

export const updateOrderShipmentStatus: UpdateOrderShipmentStatus = async (
  shipment_status: string,
  ids: number[]
) => {
  const { error } = await supabase
    .from('Orders')
    .update({ shipment_status })
    .in('id', ids)
  return { error }
}

export const deleteOrders: DeleteOrders = async (ids: number[]) => {
  const { error } = await supabase
    .from('Orders')
    .delete({ returning: 'minimal' })
    .in('id', ids)

  return { error }
}
