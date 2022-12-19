import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabaseServiceRoleClient } from '../_shared/supabase-admin.ts'

async function checkEmailAvailable(email: string) {
  if (!email) {
    return false
  }

  try {
    const { error, count } = await supabaseServiceRoleClient
      .from('Members')
      .select('*', { count: 'exact' })
      .eq('registration_email', email)

    if (error) {
      console.warn('[email-available] got error response:', error)
      return false
    }

    return count === 0
  } catch (e) {
    console.warn('[email-available] caught error! e:', e)
    return false
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { email } = await req.json()

  const ok = await checkEmailAvailable(email)

  return new Response(JSON.stringify({ ok }), {
    headers: { 'Content-Type': 'application/json' }
  })
})

// to invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"email":"test@example.com"}'
