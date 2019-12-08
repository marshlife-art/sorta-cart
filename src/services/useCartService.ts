import { useEffect, useState } from 'react'

import { AppDatabase } from '../appDatabase'
import { Service } from '../types/Service'
import { Cart } from '../types/Cart'
import { LineItem, Product } from '../types/Product'

const db = new AppDatabase()

const useCartService = () => {
  const [result, setResult] = useState<Service<Cart>>({
    status: 'loading'
  })
  useEffect(() => {
    db.cart
      .toArray()
      .then(line_items =>
        setResult({ status: 'loaded', payload: { line_items: line_items } })
      )
      .catch(e => {
        // console.warn('[useCartService] caught error:', e)
        setResult({ status: 'error', error: e })
      })

    db.on('changes', changes => {
      changes.find(change => change.table === 'cart') &&
        db.cart
          .toArray()
          .then(line_items => {
            console.log('[useCartService] db changes!! ')
            setResult({ status: 'loaded', payload: { line_items: line_items } })
          })
          .catch(e => {
            // console.warn('[useCartService] caught error:', e)
            setResult({ status: 'error', error: e })
          })
    })
  }, [])

  return result
}

const getCartItemCount = () => {
  return db.cart.count().catch(e => {
    console.warn('[useCartItemCount] caught error:', e)
    return 0
  })
}

const useCartItemCount = () => {
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    getCartItemCount().then(count => setItemCount(count))

    db.on('changes', changes => {
      changes.find(change => change.table === 'cart') &&
        getCartItemCount().then(count => setItemCount(count))
    })
  }, [])

  return itemCount
}

const addToCart = (product: Product) => {
  let line_item: LineItem = {
    ...product,
    product_id: product.id,
    quantity: 1,
    total: parseFloat(product.ws_price),
    selected_unit: 'CS'
  }
  delete line_item.id // delete id field that moved to product_id so indexDB will auto-increment and so cart items will order correctly.

  db.cart
    .add(line_item)
    .catch(error => console.warn('[addToCart] caught error:', error))
}

const removeItemFromCart = (index: number) => {
  db.cart
    .delete(index)
    .catch(error => console.warn('[removeItemFromCart] caught error:', error))
}

const emptyCart = () => {
  db.cart.clear().catch(function(err) {
    console.warn('[emptyCart] caught error:', err)
  })
}

const updateLineItem = (line_item: LineItem) => {
  db.cart
    .update(line_item.id, line_item)
    .catch(error => console.warn('[updateLineItem] caught error:', error))
}

export {
  useCartService,
  useCartItemCount,
  addToCart,
  removeItemFromCart,
  emptyCart,
  updateLineItem
}
