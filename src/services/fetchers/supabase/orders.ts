import { Query } from 'material-table'
import { supabase } from '../../../lib/supabaseClient'
import { SupaOrder, SuperOrderAndAssoc } from '../../../types/SupaTypes'
import {
  OrderDashboardFetcher,
  OrderDataTableFetcher,
  OrderFetcher,
  OrdersForMember
} from '../types'

type RecentOrders = SupaOrder[] | null

export const ordersDashboardFetcher: OrderDashboardFetcher = async () => {
  const { data, error } = await supabase.rpc('recent_orders')

  // #TODO: hmm recent_orders has unknown typing from supabase gen types?
  return {
    data: data as RecentOrders,
    error
  }
}

export const ordersForMember: OrdersForMember = async (MemberId: number) => {
  const { data, error } = await supabase
    .from('Orders')
    .select()
    .eq('MemberId', MemberId)

  return { data, error }
}

export const orderFetcher: OrderFetcher = async (id: number) => {
  const { data, error } = await supabase
    .from('Orders')
    .select('*, OrderLineItems ( * ), Members ( * )')
    .eq('id', id)
    .single()

  // #TODO: ugh `data as SuperOrderAndAssoc` ;(
  return { data: data as SuperOrderAndAssoc, error }
}

export const ordersDataTableFetcher: OrderDataTableFetcher = async (
  q: Query<SuperOrderAndAssoc>
) => {
  let query = supabase
    .from('Orders')
    .select('*, OrderLineItems ( * )', { count: 'exact' })

  if (q.filters.length) {
    q.filters.forEach((filter) => {
      if (filter.column.field && filter.value) {
        if (filter.value instanceof Array && filter.value.length) {
          const or = filter.value
            .map((v) => `${filter.column.field}.eq."${v}"`)
            .join(',')
          query = query.or(or)
        } else if (filter.value.length) {
          query = query.or(`${filter.column.field}.eq."${filter.value}"`)
        }
      }
    })
  }
  if (q.search) {
    // #todo consider q.search.split(' ')
    query = query.or(
      ['name', 'email', 'phone', 'address', 'notes']
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
    // #TODO: maybe try to be particular about the .field, here? to avoid `as any`?
    query = query.order(q.orderBy.field as any, {
      ascending: q.orderDirection === 'asc'
    })

    // { ascending?: boolean; nullsFirst?: boolean; foreignTable: string }
  } else {
    query = query.order('id', { ascending: false })
  }

  const { data, error, count } = await query

  //#TODO: ugh `data as SuperOrderAndAssoc[] | null` ;()
  return { data: data as SuperOrderAndAssoc[] | null, error, count }
}
