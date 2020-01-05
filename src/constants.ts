import { Order } from './types/Order'

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

// export const ORDER_PAYMENT_STATUSES: PaymentStatus[] = [
//   'balance_due',
//   'credit_owed',
//   'failed',
//   'paid',
//   'void'
// ]

// export const ORDER_SHIPMENT_STATUSES: ShipmentStatus[] = [
//   'backorder',
//   'canceled',
//   'partial',
//   'pending',
//   'ready',
//   'shipped'
// ]
