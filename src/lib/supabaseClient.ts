import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const SUPABASE_URL =
  process.env.MARSH_SUPABASE_URL || 'https://zlzhojhgkapokbmvokzz.supabase.co'
const SUPABASE_ANON =
  process.env.MARSH_SUPABASE_ANNON ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsemhvamhna2Fwb2tibXZva3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE0MDAzMjcsImV4cCI6MTk4Njk3NjMyN30.hKX7IsGxyKQbg59uKK28C_-Xy_FESgnHJQ0LSqNYe7k'
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.MARSH_SUPABASE_SERVICE_ROLE_KEY || ''

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON)
