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

export const SQUARE_APP_ID: string =
  process.env.NODE_ENV === 'production'
    ? 'sq0idp-TfU74GGFyRSTe7XZYsZp-g'
    : 'sandbox-sq0idb-JHHiCIhNvJdJH4pJxLaDzA'
export const SQUARE_LOCATION_ID: string =
  process.env.NODE_ENV === 'production' ? 'FY8AAVD6K7T7A' : 'D2MV0BZC6EV9Y'

// export const SQUARE_ACCESS_TOKEN: string = 'D2MV0BZC6EV9Y'
