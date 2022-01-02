import { useEffect, useState } from 'react'

import { AppDatabase } from '../appDatabase'
import { Service } from '../types/Service'
import { Cart } from '../types/Cart'
import { Product } from '../types/Product'
import { OrderLineItem } from '../types/Order'
import { IDatabaseChange } from 'dexie-observable/api'
import { API_HOST } from '../constants'
import { SupaOrderLineItem } from '../types/SupaTypes'
import { validateLineItemsService } from './orderService'

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
            // console.log('[useCartService] db changes!! ')
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

const addToCart = async (product: Product) => {
  const line_items = await db.cart.toArray()

  const existingLi = line_items.find(
    (li) =>
      li.data?.product?.unf === product.unf &&
      li.data?.product?.upc_code === product.upc_code
  )

  if (existingLi) {
    // console.log('item already exists in cart! update qty:')
    existingLi.quantity += 1
    existingLi.total = +(
      existingLi.quantity * parseFloat(`${existingLi.price}`)
    ).toFixed(2)
    updateLineItem(existingLi)
  } else {
    let line_item: OrderLineItem = {
      quantity: 1,
      total: +product.ws_price,
      selected_unit: product.unit_type,
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
}

const addStoreCreditToCart = async (storeCredit: number) => {
  // console.log('[useCartService] addStoreCreditToCart storeCredit:', storeCredit)

  const line_items = await db.cart.toArray()
  const subtotal = line_items
    .map(({ total }) => total)
    .reduce((sum, i) => sum + i, 0)

  if (subtotal <= 0) {
    // console.log('subtotal is 0 or less, not going to addStoreCreditToCart')
    return
  }

  const adjustments = line_items.filter((li) => li.kind === 'adjustment')
  if (adjustments && adjustments.length) {
    // console.log(
    //   'cart already has adjustment, not going to addStoreCreditToCart',
    //   adjustments
    // )
    return
  }
  // const subtotal =
  //   order && order.subtotal ? order.subtotal : Math.abs(storeCredit)
  const amt = Math.abs(storeCredit) >= subtotal ? -subtotal : storeCredit
  // console.log('line_items:', line_items, ' subtotal:', subtotal, ' amt:', amt)

  const adjustment: OrderLineItem = {
    description: 'STORE CREDIT',
    quantity: 1,
    price: amt,
    total: amt,
    kind: 'adjustment'
  }

  db.cart
    .add(adjustment)
    .catch((error) =>
      console.warn('[addStoreCreditToCart] caught error:', error)
    )
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

const validateLineItems = async (props: {
  removeInvalidLineItems: boolean
}) => {
  const { removeInvalidLineItems } = props
  const line_items = (await db.cart.toArray()) as SupaOrderLineItem[]

  if (line_items.length) {
    const validateResponse = await validateLineItemsService(line_items)
    // console.log(
    //   '[cartService] validateLineItemsService response:',
    //   validateResponse
    // )
    if (
      validateResponse.invalidLineItems &&
      validateResponse.invalidLineItems.length
    ) {
      for (const li of validateResponse.invalidLineItems) {
        // console.log('gonna updateLineItem li:', li)
        if (removeInvalidLineItems && li.id && li.invalid) {
          // console.log('gonna removeInvalidLineItems', li)
          removeItemFromCart(li.id)
          continue
        }
        updateLineItem(li as OrderLineItem)
      }
    }
  }
}

const setDonationAmount = async (amount: number) => {
  const line_items = await db.cart.toArray()
  const donationItem = line_items.find((li) => li.description === 'DONATION')

  if (donationItem && donationItem.id) {
    if (amount <= 0) {
      removeItemFromCart(donationItem.id)
      return
    }
    donationItem.price = +amount.toFixed(2)
    donationItem.total = +amount.toFixed(2)
    updateLineItem(donationItem)
  } else {
    const donation: OrderLineItem = {
      description: 'DONATION',
      quantity: 1,
      price: amount,
      total: amount,
      kind: 'adjustment'
    }
    db.cart
      .add(donation)
      .catch((error) =>
        console.warn('[addStoreCreditToCart] caught error:', error)
      )
  }
}

export {
  useCartService,
  useCartItemCount,
  addToCart,
  removeItemFromCart,
  emptyCart,
  updateLineItem,
  addStoreCreditToCart,
  validateLineItems,
  setDonationAmount
}
