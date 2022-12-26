import { sq } from 'date-fns/locale'
import { supabase } from '../../../lib/supabaseClient'
import { SupaSquareImport } from '../../../types/SupaTypes'
import { UpsertSquareImport } from '../types'

export const upsertSquareImport: UpsertSquareImport = async (
  squareImport: Partial<SupaSquareImport>
) => {
  const { data, error } = await supabase
    .from('squareImport')
    .upsert(squareImport)
    .select()
    .single()

  return { data, error }
}
