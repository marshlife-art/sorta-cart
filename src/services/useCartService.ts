import { useEffect, useState } from 'react'

import { AppDatabase } from '../appDatabase'
import { Service } from '../types/Service'
import { Cart } from '../types/Cart'
import { Product } from '../types/Product'
import { OrderLineItem } from '../types/Order'
import { IDatabaseChange } from 'dexie-observable/api'

const db = new AppDatabase()

const useCartService = () => {
  const [result, setResult] = useState<Service<Cart>>({
    status: 'loading'
  })
  useEffect(() => {
    db.cart
      .toArray()
      .then((line_items) =>
        setResult({ status: 'loaded', payload: { line_items: line_items } })
      )
      .catch((e) => {
        // console.warn('[useCartService] caught error:', e)
        setResult({ status: 'error', error: e })
      })

    db.on('changes', (changes) => {
      changes.find((change) => change.table === 'cart') &&
        db.cart
          .toArray()
          .then((line_items) => {
            console.log('[useCartService] db changes!! ')
            setResult({ status: 'loaded', payload: { line_items: line_items } })
          })
          .catch((e) => {
            // console.warn('[useCartService] caught error:', e)
            setResult({ status: 'error', error: e })
          })
    })
  }, [])

  return result
}

const getCartItemCount = () => {
  return db.cart.count().catch((e) => {
    console.warn('[useCartItemCount] caught error:', e)
    return 0
  })
}

const useCartItemCount = () => {
  const [itemCount, setItemCount] = useState(0)

  const subscriber = (changes: IDatabaseChange[]) => {
    changes.find((change) => change.table === 'cart') &&
      getCartItemCount().then((count) => setItemCount(count))
  }

  useEffect(() => {
    getCartItemCount().then((count) => setItemCount(count))

    db.on('changes', subscriber)

    return () => db.on('changes').unsubscribe(subscriber)
  }, [])

  return itemCount
}

const addToCart = (product: Product) => {
  let line_item: OrderLineItem = {
    quantity: 1,
    total: +product.ws_price,
    selected_unit: 'CS',
    price: +product.ws_price,
    description: `${product.name} ${product.description}`.trim(),
    kind: 'product',
    vendor: product.vendor,
    data: { product }
  }

  db.cart
    .add(line_item)
    .catch((error) => console.warn('[addToCart] caught error:', error))
}

const removeItemFromCart = (index: number) => {
  db.cart
    .delete(index)
    .catch((error) => console.warn('[removeItemFromCart] caught error:', error))
}

const emptyCart = () => {
  db.cart.clear().catch(function (err) {
    console.warn('[emptyCart] caught error:', err)
  })
}

const updateLineItem = (line_item: OrderLineItem) => {
  line_item &&
    line_item.id &&
    db.cart
      .update(line_item.id, line_item)
      .catch((error) => console.warn('[updateLineItem] caught error:', error))
}

export {
  useCartService,
  useCartItemCount,
  addToCart,
  removeItemFromCart,
  emptyCart,
  updateLineItem
}
