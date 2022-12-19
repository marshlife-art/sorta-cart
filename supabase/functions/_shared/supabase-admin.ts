import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Database } from '../../../src/types/database.types.ts'

export const supabaseServiceRoleClient = createClient<Database>(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)
