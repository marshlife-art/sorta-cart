import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const SUPABASE_URL = process.env.MARSH_SUPABASE_URL || ''
const SUPABASE_ANON = process.env.MARSH_SUPABASE_ANNON || ''
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.MARSH_SUPABASE_SERVICE_ROLE_KEY || ''

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON)
