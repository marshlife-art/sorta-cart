import { supabase } from '../../../lib/supabaseClient'
import { SupaMember } from '../../../types/SupaTypes'
import { DeleteMember, UpsertMember } from '../types'

export const deleteMember: DeleteMember = async (id: number) => {
  const { error } = await supabase.from('Members').delete().eq('id', id)
  return { error }
}

export const upsertMember: UpsertMember = async (
  member: Partial<SupaMember>
) => {
  const { error } = await supabase.from('Members').upsert(member)
  return { error }
}
