import { OrderStatus, PaymentStatus, ShipmentStatus } from './types/Order'
import { SquareStatus } from './types/WholesaleOrder'

import { Order } from './types/Order'

export const API_HOST: string =
  process.env.NODE_ENV === 'production'
    ? 'https://sorta-cart.vercel.app/api'
    : 'http://localhost:3000/api'

export const TAX_RATE = 0.06391
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

export const SQUARE_PAYMENT_JS =
  process.env.NODE_ENV === 'production'
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js'

// ? 'https://js.squareup.com/v2/paymentform'
// : 'https://js.squareupsandbox.com/v2/paymentform'

// https://sandbox.web.squarecdn.com/v1/square.js
// https://web.squarecdn.com/v1/square.js

// sorta-cart sandbox-sq0idb-JHHiCIhNvJdJH4pJxLaDzA
// marsh sandbox-sq0idb-G1XbklToIMNlwvgNoUVDCQ
export const SQUARE_APP_ID: string = 'sandbox-sq0idb-G1XbklToIMNlwvgNoUVDCQ'
export const SQUARE_LOCATION_ID: string =
  process.env.NODE_ENV === 'production' ? 'FY8AAVD6K7T7A' : 'D2MV0BZC6EV9Y'

// export const SQUARE_ACCESS_TOKEN: string = 'D2MV0BZC6EV9Y'

type OrderStatusLookup = { [key in OrderStatus]: string }
export const ORDER_STATUSES: OrderStatusLookup = {
  new: 'new',
  needs_review: 'needs review',
  pending: 'pending',
  complete: 'complete',
  void: 'void',
  archived: 'archived'
}

type OrderPaymentStatusLookup = { [key in PaymentStatus]: string }
export const PAYMENT_STATUSES: OrderPaymentStatusLookup = {
  balance_due: 'balance due',
  paid: 'paid',
  credit_owed: 'credit owed',
  failed: 'failed',
  void: 'void'
}

type OrderShipmentStatusLookup = { [key in ShipmentStatus]: string }
export const SHIPMENT_STATUSES: OrderShipmentStatusLookup = {
  backorder: 'backorder',
  pending: 'pending',
  ready: 'ready',
  shipped: 'shipped',
  partial: 'partial',
  canceled: 'canceled'
}

type SquareStatusLookup = { [key in SquareStatus]: string }
export const SQUARE_STATUSES: SquareStatusLookup = {
  new: 'new',
  ready_to_import: 'ready to import',
  complete: 'complete'
}

export const APP_VERSION = `v${
  process.env.npm_package_version || require('../package.json').version
} made with ♥ in NYC`
