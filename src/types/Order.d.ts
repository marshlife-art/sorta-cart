import { Product } from './Product'
import { User } from './User'
import { Member } from './Member'

export type PaymentStatus =
  | 'balance_due'
  | 'credit_owed'
  | 'failed'
  | 'paid'
  | 'void'
export type ShipmentStatus =
  | 'backorder'
  | 'canceled'
  | 'partial'
  | 'pending'
  | 'ready'
  | 'shipped'
export type OrderStatus =
  | 'new'
  | 'pending'
  | 'needs_review'
  | 'void'
  | 'complete'
  | 'archived'

export interface Order {
  id: number | string
  status: OrderStatus
  payment_status: PaymentStatus
  shipment_status: ShipmentStatus
  total: number
  name: string
  email: string
  phone: string
  address?: string
  notes?: string
  wantsTwoPickups?: boolean
  subtotal?: number
  item_count: number
  email_sent?: boolean
  history?: object
  createdAt: string
  updatedAt: string
  OrderLineItems: OrderLineItem[]
  UserId?: string
  User?: User
  Member?: Member
}

export type PartialOrder = Partial<Order>

export interface OrderRouterProps {
  id: string
}

export interface OrderLineItem {
  id?: number
  description?: string
  price?: number
  kind?: string
  quantity: number
  selected_unit?: string
  total: number
  vendor?: string
  WholesaleOrderId?: number
  OrderId?: number
  invalid?: string
  data?: { product?: Product }
}

export type PartialOrderDoc = Partial<OrderDoc>
