import { Query } from 'material-table'

import { SupaMember, SupaMemberWithUser } from '../../../types/SupaTypes'
import { mapMembersToAutocomplete } from '../lib'
import {
  MemberDashboardFetcher,
  MemberFetcher,
  MembersAutocompleteFetcher,
  MembersFetcher
} from '../types'

import data from './members.json'

export const membersAutocompleteFetcher: MembersAutocompleteFetcher = async ({
  q
}) => {
  if (!q) {
    return []
  }

  const members = data.filter((m) =>
    [m.name, m.registration_email, m.phone].includes(q)
  ) as unknown as SupaMemberWithUser[]

  return members.map(mapMembersToAutocomplete)
}

export const membersFetcher: MembersFetcher = async (q: Query<SupaMember>) => {
  // #TODO: handle filtering/sorting/paginating with q
  const supadata = data as unknown as SupaMember[]
  return { data: supadata, error: null, count: supadata.length }
}

export const membersDashboardFetcher: MemberDashboardFetcher = async () => {
  const supadata = data.slice(0, 10) as unknown as SupaMember[]
  return { data: supadata, error: null, count: supadata.length }
}

export const memberFetcher: MemberFetcher = async (memberId: number) => {
  const member = data.find((m) => m.id === memberId) as unknown as SupaMember
  return { data: member, error: null }
}
