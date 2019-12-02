import { PaymentStatus, ShipmentStatus } from '../types/Order'

export const ORDER_PAYMENT_STATUSES: PaymentStatus[] = [
  'balance_due',
  'credit_owed',
  'failed',
  'paid',
  'void'
]

export const ORDER_SHIPMENT_STATUSES: ShipmentStatus[] = [
  'backorder',
  'canceled',
  'partial',
  'pending',
  'ready',
  'shipped'
]

export function dateMinSec(): string {
  const date = new Date()
  return `${date.getMinutes()}${date.getSeconds()}`
}

// export function tryGetDateTime(id: string) {
//   try {
//     return new Date(parseInt(id)).toLocaleString()
//   } catch (e) {
//     console.warn('tryGetDateTime caught error:', e)
//     return ''
//   }
// }

export const API_HOST: string =
  process.env.NODE_ENV === 'production'
    ? 'https://api.marshcoop.org'
    : 'http://localhost:3000'
