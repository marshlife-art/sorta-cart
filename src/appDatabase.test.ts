import { AppDatabase } from './appDatabase'
import { OrderLineItem } from './types/Order'

const db = new AppDatabase()

const lineItem: OrderLineItem = {
  id: 3,
  selected_unit: 'CS',
  quantity: 1,
  total: 32.85,
  data: {
    product: {
      vendor: 'UNFI',
      id: 666,
      unf: '011254-0',
      upc_code: '0-74333-45848-7',
      category: 'BULK FOOD',
      sub_category: 'BULK FLOURS-SWEETNRS-BAKING SU',
      name: 'ARROWHEAD MILLS',
      description: 'Organic Flour; Unbleached White',
      pk: 25,
      size: '#',
      unit_type: 'CS',
      ws_price: '32.85',
      u_price: '1.31',
      codes: 'f, k, 2, n'
    }
  }
}

const lineItems: OrderLineItem[] = [
  {
    id: 0,
    selected_unit: 'EA',
    quantity: 1,
    total: 4.0,
    data: {
      product: {
        vendor: 'UNFI',
        id: 1801,
        unf: '173529-9',
        upc_code: '0-70734-52968-9',
        category: 'GROCERY',
        sub_category: 'BEVERAGE,TEA-BAGS/LOOSE/READY',
        name: 'CELESTIAL SEASONINGS',
        description: 'Herbal Tea; Watermelon Lime Zinger',
        pk: 6,
        size: '20 BAG',
        unit_type: 'CS',
        ws_price: '17.16',
        u_price: '4.00',
        codes: 'k, n'
      }
    }
  },
  {
    id: 1,
    // product_,
    selected_unit: 'EA',
    quantity: 1,
    total: 12.0,
    data: {
      product: {
        vendor: 'MARSH',
        id: 1813,
        unf: '',
        upc_code: '',
        category: 'MARSH',
        sub_category: 'LOCAL BAKED GOODS',
        name: 'MARSH',
        description: 'Chocolate Pecan Pie',
        pk: 1,
        size: '',
        unit_type: 'EA',
        ws_price: '12.00',
        u_price: '12.00',
        codes: ''
      }
    }
  }
]

it('can add an item', async () => {
  const cart = await db.cart
    .add(lineItem)
    .then(() => {
      return db.cart.toArray()
    })
    .catch(e => {
      console.error('add error: ' + e.stack || e)
    })

  expect(cart).toHaveLength(1)
})

it('can bulk add items', async () => {
  const cart = await db.cart
    .bulkAdd(lineItems)
    .then(() => db.cart.toArray())
    .catch(e => {
      console.error('bulkAdd error: ' + e.stack || e)
    })

  expect(cart).toHaveLength(3)
})
