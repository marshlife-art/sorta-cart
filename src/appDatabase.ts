import Dexie from 'dexie'
import 'dexie-observable'

import { LineItem } from './types/Product'

export class AppDatabase extends Dexie {
  cart: Dexie.Table<LineItem, number>

  constructor() {
    super('SortaCartDatabase')
    this.version(1).stores({
      cart: '++id,&product_id'
    })
    this.cart = this.table('cart')
  }
}
