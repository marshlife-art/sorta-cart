import { SupaWholesaleOrder } from '../../../types/SupaTypes'
import {
  DeleteWholesaleOrder,
  InsertWholesaleOrder,
  UpsertWholesaleOrder
} from '../types'

export const insertWholesaleOrder: InsertWholesaleOrder = async (
  wholesaleOrder: Partial<SupaWholesaleOrder>
) => {
  // #TODO
  return { data: null, error: null }
}

export const deleteWholesaleOrder: DeleteWholesaleOrder = async (
  id: number
) => {
  // #TODO

  return { error: null }
}

export const upsertWholesaleOrder: UpsertWholesaleOrder = async (
  wholesaleOrder: Partial<SupaWholesaleOrder>
) => {
  // #TODO
  return { data: null, error: null }
}
