import { Query } from 'material-table'
import { SupaOrder, SuperOrderAndAssoc } from '../../../types/SupaTypes'
import {
  OrderDashboardFetcher,
  OrderDataTableFetcher,
  OrderFetcher,
  OrdersForMember
} from '../types'

import ordersData from './orders.json'

const orders = ordersData as unknown as SupaOrder[]

export const ordersDashboardFetcher: OrderDashboardFetcher = async () => {
  return {
    data: orders.slice(0, 10),
    error: null
  }
}

export const ordersForMember: OrdersForMember = async (MemberId: number) => {
  return { data: orders.filter((o) => o.MemberId === MemberId), error: null }
}

export const orderFetcher: OrderFetcher = async (id: number) => {
  const data = orders.find((o) => o.id === id) as SuperOrderAndAssoc
  return { data, error: null }
}

export const ordersDataTableFetcher: OrderDataTableFetcher = async (
  q: Query<SuperOrderAndAssoc>
) => {
  const data = orders as unknown as SuperOrderAndAssoc[]
  return { data, error: null, count: data.length }
}
