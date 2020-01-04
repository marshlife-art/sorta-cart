import { Product } from './types/Product'
import { User } from './types//User'
import { Member } from './types/Member'
import { Order } from './types/Order'

// export type PaymentStatus =
//   | 'balance_due'
//   | 'credit_owed'
//   | 'failed'
//   | 'paid'
//   | 'void'
// export type ShipmentStatus =
//   | 'backorder'
//   | 'canceled'
//   | 'partial'
//   | 'pending'
//   | 'ready'
//   | 'shipped'
// export type OrderStatus =
//   | 'new'
//   | 'pending'
//   | 'needs_review'
//   | 'void'
//   | 'complete'
//   | 'archived'

// export interface Order {
//   id: number | string
//   status: OrderStatus
//   payment_status: PaymentStatus
//   shipment_status: ShipmentStatus
//   total: number
//   name: string
//   email: string
//   phone: string
//   address?: string
//   notes?: string
//   subtotal?: number
//   item_count: number
//   email_sent?: boolean
//   history?: object
//   createdAt: string
//   updatedAt: string
//   OrderLineItems: LineItem[]
//   UserId?: string
//   User?: User
//   Member?: Member
// }

// export type PartialOrder = Partial<Order>

// export interface OrderRouterProps {
//   id: string
// }

// export interface LineItem {
//   id?: string
//   description: string
//   quantity: number
//   selected_unit?: string
//   price: number
//   total: number
//   kind: string
//   vendor?: string
//   WholesaleOrderId?: number
//   OrderId?: number
//   data?: { product?: Product }
// }

export const API_HOST: string =
  process.env.NODE_ENV === 'production'
    ? 'https://api.marshcoop.org'
    : 'http://localhost:3000'

export const TAX_RATE = 0.06175
export const TAX_RATE_STRING = `${(TAX_RATE * 100).toFixed(3)}%`

export const BLANK_ORDER: Order = {
  id: 'new',
  status: 'new',
  payment_status: 'balance_due',
  shipment_status: 'backorder',
  total: 0.0,
  item_count: 0,
  subtotal: 0,
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
  createdAt: '',
  updatedAt: '',
  OrderLineItems: []
}
