import { supabase } from './supabaseClient'
import {
  SupaOrder,
  SupaOrderLineItem,
  SupaOrderWithLineItems,
  SuperOrderAndAssoc
} from '../types/SupaTypes'

import { TAX_RATE } from '../constants'
import { Json } from '../types/database.types'

type OrderWithoutId = Omit<SupaOrder, 'id'> & {
  id?: number
}
type SupaOrderLineItemWithOutId = Omit<SupaOrderLineItem, 'id'> & {
  id?: number
}

export const createOrder = async (
  order: OrderWithoutId,
  orderLineItems: SupaOrderLineItemWithOutId[]
) => {
  const { data, error } = await supabase
    .from('Orders')
    .insert({
      ...order,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined
    })
    .select()

  const o = data && data[0]
  if (error || !o || !o.id) {
    return null // ...something?
  }

  for await (const oli of orderLineItems) {
    await supabase.from('OrderLineItems').insert({
      ...oli,
      data: oli.data as Json,
      OrderId: o.id
    })
  }

  return o

  // #TODO deal with on_hand_count checking like:
  // mainly tag line items with status 'on_hand' and
  // split line items between product's count_on_hand and the oli quantity (if necessary)

  // order.OrderLineItems.map((oli) => delete oli.id)
  // const createdOrder = await Order.create(order, { include: [OrderLineItem] })
  // const additionalBackOrderItems = []
  // for await (let oli of createdOrder.OrderLineItems) {
  //   if (oli?.data?.product?.unf || oli?.data?.product?.upc_code) {
  //     const product = await Product.findOne({
  //       attributes: ['u_price', 'count_on_hand'],
  //       where: {
  //         unf: oli.data.product.unf,
  //         upc_code: oli.data.product.upc_code
  //       },
  //       raw: true
  //     })
  //     const pCount = isNaN(parseInt(product.count_on_hand))
  //       ? 0
  //       : parseInt(product.count_on_hand)
  //     // so 1. check if there's enough count_on_hand to satasify this li.
  //     //  if so, set status = 'on_hand' and Product.decrement('count_on_hand'
  //     // if there only some count_on_hand for this li then:
  //     //   Product.decrement('count_on_hand') whaterver product.count_on_hand
  //     //   set oli.status = 'on_hand' and oli.quantity = eaQty and oli.selected_unit = 'EA'
  //     //   and create a new oli with remainder.
  //     // only account for EA selected_unit, let CS units move to backorder
  //     if (pCount > 0 && oli.selected_unit === 'EA') {
  //       const eaQty = isNaN(parseInt(`${oli.quantity}`))
  //         ? 0
  //         : parseInt(`${oli.quantity}`)
  //       if (eaQty > pCount) {
  //         // need to create a backorder line item
  //         const price = parseFloat(`${product.u_price}`)
  //         additionalBackOrderItems.push({
  //           ...oli.get({ plain: true }),
  //           quantity: eaQty - pCount,
  //           price,
  //           total: +((eaQty - pCount) * price).toFixed(2),
  //           status: 'backorder',
  //           selected_unit: 'EA'
  //         })
  //         oli.price = price
  //         oli.total = +(pCount * price).toFixed(2)
  //         oli.quantity = pCount
  //         oli.selected_unit = 'EA'
  //       }
  //       oli.status = 'on_hand'
  //       await oli.save()
  //       await Product.decrement('count_on_hand', {
  //         by: Math.min(eaQty, pCount),
  //         where: {
  //           unf: oli.data.product.unf,
  //           upc_code: oli.data.product.upc_code
  //         }
  //       }).catch((error) =>
  //         console.warn(
  //           'caught error trying to decrement Product.count_on_hand! err:',
  //           error
  //         )
  //       )
  //     } else {
  //       oli.status = 'backorder'
  //       await oli.save()
  //     }
  //   }
  // }
  // for await (li of additionalBackOrderItems) {
  //   try {
  //     delete li.id
  //     const newoli = await OrderLineItem.create(li)
  //     await createdOrder.addOrderLineItem(newoli)
  //   } catch (error) {
  //     console.warn('caught error trying to addOrderLineItem! error:', error)
  //   }
  // }
  // return await createdOrder.reload()
}

export const updateOrder = async (
  order: OrderWithoutId,
  orderLineItems: SupaOrderLineItem[]
) => {
  if (!order || !order.id) {
    // throw new Error('no such order id exist to update!')
    console.warn('no such order id exist to update!')
    return null
  }

  const { data, error } = await supabase
    .from('Orders')
    .update({
      ...order,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined
    })
    .eq('id', order.id)
    .select()

  const o = data && data[0]
  if (error || !o || !o.id) {
    console.warn('onoz updateOrder got error:', error)
    return null // ...something?
  }

  // prevent orpahned OrderLineItems, purge existing ones first.
  const { error: oldDeleteError } = await supabase
    .from('OrderLineItems')
    .delete()
    .eq('OrderId', order.id)

  if (oldDeleteError) {
    console.warn('onoz oldDeleteError:', oldDeleteError)
    return null
  }

  for await (const oli of orderLineItems) {
    const { error: oldCreateError } = await supabase
      .from('OrderLineItems')
      .insert({
        ...oli,
        data: oli.data as Json,
        OrderId: o.id
      })
    if (oldCreateError) {
      console.warn('onoz oldCreateError:', oldCreateError)
    }
  }

  return o
}

export interface OrderCreditItem {
  OrderId: string | number
  total: number
  description: string
}

function toMoney(input: any) {
  if (isNaN(parseFloat(input))) {
    return 0
  }
  return +parseFloat(input).toFixed(2)
}

export const createOrderCredits = async (items: OrderCreditItem[]) => {
  if (!items || items.length === 0) {
    throw new Error('[createOrderCredits] invalid request!')
  }

  return await Promise.all(
    items.map(async (item) => {
      if (item.OrderId && item.total && item.description) {
        const OrderId = parseInt(`${item.OrderId}`)
        const absPrice = Math.abs(parseFloat(`${item.total}`))
        const price = toMoney(-absPrice)
        const total = toMoney(-(absPrice + absPrice * TAX_RATE))

        const { data: orderLineItems, error } = await supabase
          .from('OrderLineItems')
          .select()
          .eq('OrderId', OrderId)
          .eq('kind', 'credit')
          .eq('total', total)

        if (error || !orderLineItems || orderLineItems.length > 0) {
          return
        }

        await supabase.from('OrderLineItems').insert({
          quantity: 1,
          price,
          total,
          description: `STORE CREDIT (${item.description})`,
          kind: 'credit',
          OrderId
        })
      }
    })
  )
}
