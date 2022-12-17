import { Query } from 'material-table'
import { OrderStatus } from '../../../types/Order'
import {
  SupaOrderLineItem,
  SupaOrderLineItemData,
  SupaWholesaleOrder
} from '../../../types/SupaTypes'
import { tryParseData } from '../lib'
import {
  WholesaleOrderDashboardFetcher,
  WholesaleOrderFetcher,
  WholesaleOrderLineItemsFetcher,
  WholesaleOrdersDataTableFetcher,
  WholesaleOrdersFetcher
} from '../types'

import wholesaleordersData from './wholesaleorders.json'
import orderlineitems from './orderlineitems.json'

const wholesaleorders = wholesaleordersData as unknown as SupaWholesaleOrder[]

const supaorderlineitems = orderlineitems.map((oli) => ({
  ...oli,
  data: tryParseData<SupaOrderLineItemData>(oli.data)
})) as unknown as SupaOrderLineItem[]

export const wholesaleOrdersFetcher: WholesaleOrdersFetcher = async (
  status: OrderStatus
) => {
  return { data: wholesaleorders, error: null, count: wholesaleorders.length }
}

export const wholesaleOrderFetcher: WholesaleOrderFetcher = async (
  id: number
) => {
  return { data: wholesaleorders.find((w) => w.id === id) || null, error: null }
}

export const wholesaleOrdersDashboardFetcher: WholesaleOrderDashboardFetcher =
  async () => {
    return {
      data: wholesaleorders,
      error: null
    }
  }

export const wholesaleOrdersDataTableFetcher: WholesaleOrdersDataTableFetcher =
  async (q: Query<SupaOrderLineItem> | Query<SupaWholesaleOrder>) => {
    return {
      data: supaorderlineitems,
      error: null,
      count: 0
    }
  }

export const wholesaleOrderLineItemsFetcher: WholesaleOrderLineItemsFetcher =
  async () => {
    return {
      data: supaorderlineitems,
      error: null,
      count: supaorderlineitems.length
    }
  }
