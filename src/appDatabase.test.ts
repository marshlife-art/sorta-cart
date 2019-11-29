import { AppDatabase, ICart } from './appDatabase'

// demo
const db = new AppDatabase()
const demoCart: ICart = {
  id: 3,
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
  codes: 'f, k, 2, n',
  selected_unit: 'CS',
  quantity: 1,
  total: 32.85
}

it('can add an item', async () => {
  const cart = await db.cart
    .add(demoCart)
    .then(() => {
      return db.cart.toArray()
    })
    .catch(e => {
      alert('error: ' + e.stack || e)
    })

  expect(cart).toBeTruthy()
})
