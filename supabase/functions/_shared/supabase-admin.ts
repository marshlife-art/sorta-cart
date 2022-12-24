import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Database } from '../_shared/types/supabase.ts'

export const supabaseServiceRoleClient = createClient<Database>(
  Deno.env.get('MARSH_SUPABASE_URL') ?? '',
  Deno.env.get('MARSH_SUPABASE_SERVICE_ROLE_KEY') ?? ''
)
