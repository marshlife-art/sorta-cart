import { supabase } from '../lib/supabaseClient'
import { SupaMember, SupaOrderLineItem, SupaProduct } from '../types/SupaTypes'

type LineItemValidation = SupaOrderLineItem & {
  invalid?: string
}

function tryParseData(data: any) {
  try {
    return JSON.parse(data)
  } catch (e) {
    return data
  }
}

export async function validateLineItemsService(lineItems: SupaOrderLineItem[]) {
  // jesus-fuck if/else! should probz look into assertion lib (like joi?)

  let invalidLineItems = []
  for (const item of lineItems) {
    const li: LineItemValidation = { ...item }

    // only check product kind
    if (li.kind !== 'product') {
      continue
    }

    // bad price, total, or quantity.
    if (
      li.price === undefined ||
      li.total === undefined ||
      li.quantity === undefined
    ) {
      li.invalid = 'price, total, or quantity undefined.'
      invalidLineItems.push(li)
      continue
    }

    if (li.price < 0 || li.total < 0 || li.quantity < 0) {
      li.invalid = 'price, total, or quantity less than zero.'
      li.quantity = 0
      li.total = 0
      invalidLineItems.push(li)
      continue
    }

    const liData = tryParseData(li.data)
    // no product data ref
    if (
      !liData ||
      !liData.product ||
      !(liData.product.unf || liData.product.upc_code)
    ) {
      li.invalid = 'product no longer available.'
      li.quantity = 0
      li.total = 0
      invalidLineItems.push(li)
      continue
    }

    // console.log(
    //   'validateLineItemsService looking for: ',
    //   liData.product.id,
    //   ' liData:',
    //   liData
    // )

    const { data: product, error } = await supabase
      .from<SupaProduct>('products')
      .select()
      .eq('id', liData.product.id)
      .single()

    if (error || !product) {
      console.warn('validateLineItemsService error, product', error, product)
      li.invalid = 'product no longer exists.'
      li.quantity = 0
      li.total = 0
      invalidLineItems.push(li)
      continue
    }

    if (
      product.ws_price !== liData.product.ws_price ||
      product.u_price !== liData.product.u_price
    ) {
      li.invalid = undefined
      const liPrice =
        li.selected_unit === 'CS' ? product.ws_price : product.u_price
      const liPriceMoney = +parseFloat(`${liPrice}`).toFixed(2)
      li.price = liPriceMoney
      li.total = +(liPriceMoney * parseInt(`${li.quantity}`)).toFixed(2)
      invalidLineItems.push(li)
      continue
    }

    // convert CS units to EA units before checking count_on_hand.
    const caseMultiplier =
      !isNaN(parseInt(`${liData.product?.pk}`)) && li.selected_unit === 'CS'
        ? parseInt(`${liData.product?.pk}`)
        : 1

    const eaQty = isNaN(parseInt(`${li.quantity}`))
      ? 0
      : parseInt(`${li.quantity}`) * caseMultiplier

    if (product.count_on_hand && eaQty > product.count_on_hand) {
      if (product.no_backorder === true) {
        li.invalid = undefined
        li.selected_unit = 'EA'
        li.price = +parseFloat(`${product.u_price}`).toFixed(2)
        li.quantity = Math.abs(product.count_on_hand)
        li.total = +(
          parseInt(`${li.quantity}`) * parseFloat(`${li.price}`)
        ).toFixed(2)
        // overwrite the product to db changes (like cont_on_hand and no_backorder) since item was added to cart.
        liData.product = product
        invalidLineItems.push(li)
        continue
      }
      // else {
      //   continue
      // }
    }

    const liPrice =
      li.selected_unit === 'CS' ? product.ws_price : product.u_price
    if (
      li.price != liPrice ||
      li.total != +(liPrice * li.quantity).toFixed(2)
      // note: not using super-strict comparison !== here :/
    ) {
      li.invalid = undefined
      li.price = parseFloat(`${liPrice}`)
      li.total = +(
        parseFloat(`${liPrice}`) * parseFloat(`${li.quantity}`)
      ).toFixed(2)
      invalidLineItems.push(li)
      continue
    }
  }

  return {
    error: invalidLineItems.length > 0,
    invalidLineItems
  }
}

export async function getMyMember(userId: string) {
  // if(!userId){
  //   return null
  // }

  const { data: member, error } = await supabase
    .from<SupaMember>('Members')
    .select()
    .eq('UserId', userId)
    .single()

  return member
}