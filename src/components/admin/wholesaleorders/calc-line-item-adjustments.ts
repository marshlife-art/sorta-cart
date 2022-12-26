import { SupaOrderLineItem } from '../../../types/SupaTypes'
import { GroupedItem, LineItemData } from './EditWholesaleOrder'

function toMoney(input: any) {
  if (isNaN(parseFloat(input))) {
    return 0
  }
  return +parseFloat(input).toFixed(2)
}

export function calcLineItemAdjustments(props: {
  lineItems: SupaOrderLineItem[] | null
}) {
  const { lineItems } = props

  let lineItemData: LineItemData = {
    groupedLineItems: {},
    productTotal: 0,
    adjustmentTotal: 0,
    orderTotal: 0
  }

  let groupedLineItems: {
    [key: string]: GroupedItem
  } = {}

  lineItems?.forEach((li) => {
    const id =
      li.data &&
      li.data.product &&
      `${li.data.product.unf}${li.data.product.upc_code}`
    const key = id ? id : li.description || 'unknown'

    let acc = groupedLineItems[key]

    const qty: number =
      li.data && li.data.product && li.selected_unit === 'EA'
        ? (li.quantity || 1) / (li.data.product.pk || 1)
        : li.quantity || 1

    const qtyUnits =
      li.data && li.data.product && li.selected_unit === 'CS'
        ? (li.quantity || 1) * (li.data.product.pk || 1)
        : li.quantity || 1

    const wsPriceCost = isNaN(Number(li.data?.product?.ws_price_cost))
      ? 0
      : Number(li.data?.product?.ws_price_cost)
    const liTotalCheck = isNaN(Number(li.total)) ? 0 : Number(li.total)
    const liTotal =
      (li.data && li.data.product
        ? +(wsPriceCost * qty).toFixed(2)
        : liTotalCheck) || 0

    groupedLineItems[key] = {
      qtySum: acc ? acc.qtySum + qty : qty,
      qtyUnits: acc ? acc.qtyUnits + qtyUnits : qtyUnits,
      qtyAdjustments: 0,
      totalSum: toMoney(acc ? acc.totalSum + liTotal : liTotal),
      product: li && li.data && li.data.product,
      vendor: li.vendor ?? undefined,
      description: li.description || 'no description',
      line_items: acc ? [...acc.line_items, li] : [li]
    }

    lineItemData = {
      ...lineItemData,
      productTotal: lineItemData.productTotal + parseFloat(`${liTotal}`),
      orderTotal: lineItemData.orderTotal + liTotal
    }
  })

  Object.values(groupedLineItems).forEach((item) => {
    // check if qtySum is not a round number (i.e. a partial case)
    if (item.qtySum % 1 !== 0 && item.product) {
      const pk = item.product.pk || 1
      const qty = item.line_items.reduce(
        (acc, v) =>
          acc + (v.selected_unit === 'EA' && v.quantity ? v.quantity : 0),
        0
      )
      // quantity needed to complete a case
      const quantity = Math.abs((qty % pk) - pk)
      const uPriceCost = isNaN(Number(item.product.u_price_cost))
        ? 0
        : Number(item.product.u_price_cost)
      const price = +(quantity * uPriceCost).toFixed(2)

      const total = isNaN(Number(price)) ? 0 : Number(price)
      // if (calcAdjustments) {
      item.line_items.push({
        quantity,
        price,
        total,
        kind: 'adjustment',
        description: `add ${quantity} EA`
      })
      // }
      // also add to the sums when creating this adjustment.
      item.totalSum = toMoney(item.totalSum + total)
      item.qtySum = Math.round(item.qtySum + quantity / pk)
      item.qtyAdjustments = quantity

      lineItemData = {
        ...lineItemData,
        adjustmentTotal: lineItemData.adjustmentTotal + +total,
        orderTotal: lineItemData.orderTotal + total
      }
    } else if (item.line_items && item.product) {
      // okay, so try to figure out if this is a manually added line item (i.e. no orderId)
      const qtyAdjustments = item.line_items.reduce((acc, li) => {
        if (!li.OrderId) {
          const pk = item.product?.pk || 1
          const qty = li.quantity || 1
          acc += pk * qty
        }
        return acc
      }, 0)
      if (qtyAdjustments) {
        item.qtyAdjustments = qtyAdjustments
      }
    }
  })

  return {
    ...lineItemData,
    groupedLineItems
  }
}
