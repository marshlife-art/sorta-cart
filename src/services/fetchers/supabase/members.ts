import { Query } from 'material-table'
import { supabase } from '../../../lib/supabaseClient'
import { SupaMember } from '../../../types/SupaTypes'
import { mapMembersToAutocomplete } from '../lib'
import {
  MembersAutocompleteFetcher,
  MembersFetcher,
  MemberDashboardFetcher,
  MemberFetcher
} from '../types'

export const membersAutocompleteFetcher: MembersAutocompleteFetcher = async ({
  q
}) => {
  if (!q) {
    return []
  }
  let query = supabase.from('Members').select()

  if (q) {
    query = query.or(
      ['name', 'registration_email', 'phone']
        .map((f) => `${f}.ilike."%${q}%"`)
        .join(',')
    )
  }

  const { data: members, error } = await query

  if (error || !members) {
    return []
  }

  return members.map(mapMembersToAutocomplete)
}

export const membersFetcher: MembersFetcher = async (q: Query<SupaMember>) => {
  let query = supabase
    .from<SupaMember>('Members')
    .select('*', { count: 'exact' })
  //, users ( * ) i think need to use service role or otherwise setup rls for users relation?

  if (q.filters.length) {
    const or = q.filters
      .map((filter) => {
        if (filter.column.field && filter.value) {
          if (filter.value instanceof Array && filter.value.length) {
            return filter.value.map((v) => {
              // NOTE: ilike only seems to work on string fields
              if (filter.column.field === 'member_type') {
                return `${filter.column.field}.ilike."%${v}%"`
              }
              return `${filter.column.field}.eq.${v}`
            })
          } else if (filter.value.length) {
            if (filter.column.field === 'member_type') {
              return `${filter.column.field}.ilike."%${filter.value}%"`
            } else {
              return `${filter.column.field}.eq."${filter.value}"`
            }
          }
        }
      })
      .join(',')

    query = query.or(or)
  }
  if (q.search) {
    query = query.or(
      ['name', 'phone', 'address', 'registration_email']
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
    query = query.order(q.orderBy.field as keyof SupaMember, {
      ascending: q.orderDirection === 'asc'
    })
  } else {
    query = query.order('createdAt', { ascending: false })
  }

  const { data, error, count } = await query

  return { data, error, count }
}

export const membersDashboardFetcher: MemberDashboardFetcher = async () => {
  const { data, error, count } = await supabase
    .from<SupaMember>('Members')
    .select('*', { count: 'exact' })
    .order('createdAt', { ascending: false })
    .limit(10)

  return { data, error, count }
}

export const memberFetcher: MemberFetcher = async (memberId: number) => {
  const { data, error } = await supabase
    .from<SupaMember>('Members')
    .select()
    .eq('id', memberId)
    .single()

  return { data, error }
}
