import Dexie from 'dexie'
import 'dexie-observable'
import { SupaOrderLineItem } from './types/SupaTypes'

type PartialLineItem = Partial<SupaOrderLineItem>
export class AppDatabase extends Dexie {
  cart: Dexie.Table<PartialLineItem, number>

  constructor() {
    super('SortaCartDatabase')
    this.version(1).stores({
      cart: '++id'
    })
    this.cart = this.table('cart')
  }
}
