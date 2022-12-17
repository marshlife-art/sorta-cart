import useSWR from 'swr'
import { ordersDashboardFetcher } from '../fetchers'

export function useOrdersDashboard() {
  const { data, error } = useSWR('dashboard_orders', ordersDashboardFetcher)

  return {
    orders: data,
    isLoading: !error && !data,
    isError: error
  }
}
