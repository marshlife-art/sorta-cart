import { Query } from 'material-table'
import { supabase } from '../../../lib/supabaseClient'
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

export const wholesaleOrdersFetcher: WholesaleOrdersFetcher = async (
  status: OrderStatus
) => {
  let query = supabase.from<SupaWholesaleOrder>('WholesaleOrders').select()
  if (status) {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query
  return { data, error, count }
}

export const wholesaleOrderFetcher: WholesaleOrderFetcher = async (
  id: number
) => {
  const { data, error } = await supabase
    .from<SupaWholesaleOrder>('WholesaleOrders')
    .select('*, OrderLineItems ( * )')
    .eq('id', id)
    .single()
  return { data, error }
}

export const wholesaleOrdersDashboardFetcher: WholesaleOrderDashboardFetcher =
  async () => {
    const { data, error } = await supabase
      .from<SupaWholesaleOrder>('WholesaleOrders')
      .select('*', { count: 'exact' })
      .order('createdAt', { ascending: false })
      .limit(10)

    return {
      data,
      error
    }
  }

export const wholesaleOrdersDataTableFetcher: WholesaleOrdersDataTableFetcher =
  async (q: Query<SupaOrderLineItem> | Query<SupaWholesaleOrder>) => {
    let query = supabase
      .from<SupaOrderLineItem>('OrderLineItems')
      .select('*', { count: 'exact' })
      .is('WholesaleOrderId', null)
      .eq('kind', 'product')
      .or('status.neq.on_hand,status.is.null')

    //(status != 'on_hand' or status is null)
    if (q.filters.length) {
      q.filters.forEach((filter) => {
        if (filter.column.field && filter.value) {
          if (filter.value instanceof Array && filter.value.length) {
            const or = filter.value
              .map((v) => `${String(filter.column.field)}.eq."${v}"`)
              .join(',')
            query = query.or(or)
          } else if (filter.value.length) {
            query = query.or(
              `${String(filter.column.field)}.eq."${filter.value}"`
            )
          }
        }
      })
    }

    if (q.search) {
      // #todo consider q.search.split(' ')
      query = query.or(
        ['vendor', 'description']
          .map((f) => `${f}.ilike."%${q.search}%"`)
          .join(',')
      )
    }
    if (q.page) {
      query = query.range(q.pageSize * q.page, q.pageSize * q.page + q.pageSize)
    }
    if (q.pageSize) {
      query = query.limit(q.pageSize)
    }
    if (q.orderBy && q.orderBy.field) {
      query = query.order(q.orderBy.field as keyof SupaOrderLineItem, {
        ascending: q.orderDirection === 'asc'
      })
    }

    const { data, error, count } = await query

    return {
      data: data?.map((oli) => ({
        ...oli,
        data: tryParseData<SupaOrderLineItemData>(oli.data)
      })) as SupaOrderLineItem[],
      error,
      count
    }
  }

export const wholesaleOrderLineItemsFetcher: WholesaleOrderLineItemsFetcher =
  async () => {
    let query = supabase
      .from<SupaOrderLineItem>('OrderLineItems')
      .select('*', { count: 'exact' })
      .is('WholesaleOrderId', null)
      .eq('kind', 'product')
      .or('status.neq.on_hand,status.is.null')

    const { data, error, count } = await query

    return {
      data: data?.map((oli) => ({
        ...oli,
        data: tryParseData<SupaOrderLineItemData>(oli.data)
      })) as SupaOrderLineItem[],
      error,
      count
    }
  }
