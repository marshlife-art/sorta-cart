import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, jsonCorsHeaders } from '../_shared/cors.ts'
import { createPayment } from '../_shared/square/payments.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { sourceId, amountCents, autocomplete, note } = await req.json()

  if (!sourceId || !amountCents) {
    return new Response(JSON.stringify({ error: 'missing required fields!' }), {
      headers: jsonCorsHeaders,
      status: 500
    })
  }

  let paymentResponse = undefined
  try {
    paymentResponse = await createPayment({
      sourceId,
      amountCents,
      autocomplete: !!autocomplete,
      note
    })
    console.log('[square-payment] order paymentResponse:', paymentResponse)
  } catch (e) {
    console.warn(
      '[square-payment] onoz! caught error in createPayment error:',
      e.response.text,
      JSON.stringify(e)
    )
    return new Response(JSON.stringify({ error: 'payment error' }), {
      headers: jsonCorsHeaders,
      status: 500
    })
  }

  // #TODO: hmm, return sourceId if !autocomplete? otherwise paymentResponse
  return new Response(
    JSON.stringify({
      success: true,
      msg: 'ok',
      paymentResponse: {
        ...paymentResponse,
        id: !autocomplete ? sourceId : paymentResponse.id
      }
    }),
    {
      headers: jsonCorsHeaders
    }
  )
})
