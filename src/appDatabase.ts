import Dexie from 'dexie'

export interface ICart {
  id?: number
  unf: string
  upc_code: string
  category: string
  sub_category: string
  name: string
  description: string
  pk: number
  size: string
  unit_type: string
  ws_price: string
  u_price: string
  codes: string
  quantity: number
  selected_unit: string
  total: number
}

export class AppDatabase extends Dexie {
  cart: Dexie.Table<ICart, number>

  constructor() {
    super('SortaCartDatabase')
    this.version(1).stores({
      cart: '++id,name'
    })
    this.cart = this.table('cart')
  }
}
