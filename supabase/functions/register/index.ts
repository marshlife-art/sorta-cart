import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createPayment } from '../_shared/square/payments.ts'
import { supabaseServiceRoleClient } from '../_shared/supabase-admin.ts'
import { SupaMember } from '../_shared/types/SupaTypes.ts'

async function insertMember(member: Partial<SupaMember>) {
  const { data, error } = await supabaseServiceRoleClient
    .from('Members')
    .insert(member)
    .select()

  if (error) {
    return {
      msg: error.message,
      member: null
    }
  }
  return {
    msg: 'Success!',
    member: data
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { member: newMember, user: newUser, sourceId } = await req.json()

  try {
    const amountCents = Math.round(newMember.fees_paid * 100)
    const paymentResponse = await createPayment({
      sourceId,
      amountCents
    })
    console.log('[register] square payment result:', paymentResponse)

    const { data, error } =
      await supabaseServiceRoleClient.auth.admin.createUser({
        email: newUser.email
      })

    const { user } = data
    // console.log('[api/members/register]  createUser error, user:', error, user)
    if (error || !user) {
      return new Response(
        JSON.stringify({ member: null, msg: 'unable to create member!' }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    await supabaseServiceRoleClient.auth.admin.updateUserById(user.id, {
      user_metadata: { marsh_role: 'member' }
    })

    const { member, msg } = await insertMember({
      ...newMember,
      UserId: user.id
    })
    console.log('[register] insertMember msg, member:', msg, member, user)

    if (member) {
      return new Response(JSON.stringify({ member, msg: 'ok', user }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(
        JSON.stringify({ member: null, msg: 'unable to create member!' }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }
  } catch (e) {
    console.warn('[register] caught error:', e)
    return new Response(JSON.stringify({ error: 'register error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
