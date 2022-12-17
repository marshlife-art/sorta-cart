import { SupaMember } from '../../../types/SupaTypes'
import { DeleteMember, UpsertMember } from '../types'

export const deleteMember: DeleteMember = async (id: number) => {
  // #TODO
  return { error: null }
}

export const upsertMember: UpsertMember = async (
  member: Partial<SupaMember>
) => {
  // #TODO
  return { error: null }
}
