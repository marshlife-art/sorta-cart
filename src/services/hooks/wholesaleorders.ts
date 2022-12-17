import useSWR from 'swr'
import {
  wholesaleOrdersDashboardFetcher,
  wholesaleOrderLineItemsFetcher
} from '../fetchers'

export function useWholesaleOrdersDashboard() {
  const { data, error } = useSWR(
    'dashboard_wholesaleorders',
    wholesaleOrdersDashboardFetcher
  )

  return {
    wholesaleOrders: data,
    isLoading: !error && !data,
    isError: error
  }
}

export function useWholesaleOrderLineItems() {
  const { data, error } = useSWR(
    'wholesale_order_line_items',
    wholesaleOrderLineItemsFetcher
  )

  console.log('uh useWholesaleOrderLineItems data, error: ', data, error)
  return {
    wholesaleOrders: data?.data,
    count: data?.count,
    isLoading: !error && !data,
    isError: error
  }
}
