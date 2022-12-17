import useSWR from 'swr'
import {
  membersAutocompleteFetcher,
  membersDashboardFetcher
} from '../fetchers'

export function useMembersAutocomplete(q: string) {
  const { data, error } = useSWR(
    { key: 'member_autocomplete', q },
    membersAutocompleteFetcher
  )

  return {
    members: data,
    isLoading: !error && !data,
    isError: error
  }
}

export function useMembersDashboard() {
  const { data, error } = useSWR('dashboard_members', membersDashboardFetcher)

  return {
    members: data,
    isLoading: !error && !data,
    isError: error
  }
}
