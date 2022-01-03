import Dexie from 'dexie'
import 'dexie-observable'

import { OrderLineItem } from './types/Order'
// import { SupaOrderLineItem } from './types/SupaTypes'

export class AppDatabase extends Dexie {
  cart: Dexie.Table<OrderLineItem, number>

  constructor() {
    super('SortaCartDatabase')
    this.version(1).stores({
      cart: '++id'
    })
    this.cart = this.table('cart')
  }
}
