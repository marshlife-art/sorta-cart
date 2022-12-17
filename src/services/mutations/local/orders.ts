import {
  UpdateOrderStatus,
  UpdateOrderShipmentStatus,
  DeleteOrders
} from '../types'

export const updateOrderStatus: UpdateOrderStatus = async (
  status: string,
  ids: number[]
) => {
  // #TODO
  return { error: null }
}

export const updateOrderShipmentStatus: UpdateOrderShipmentStatus = async (
  shipment_status: string,
  ids: number[]
) => {
  // #TODO
  return { error: null }
}

export const deleteOrders: DeleteOrders = async (ids: number[]) => {
  // #TODO
  return { error: null }
}
