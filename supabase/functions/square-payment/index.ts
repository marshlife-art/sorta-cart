import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createPayment } from '../_shared/square/payments.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { order, nonce } = await req.json()

  if (!order || !order.name || !order.email || !order.total || !nonce) {
    return new Response(JSON.stringify({ error: 'missing required fields!' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }

  let paymentResponse = undefined
  try {
    paymentResponse = await createPayment({
      sourceId: nonce,
      amountCents: order.total * 100,
      note: `Order Payment ${order.name} ${order.email}`
    })
    console.log('[square-payment] order paymentResponse:', paymentResponse)
  } catch (e) {
    console.warn(
      '[square-payment] onoz! caught error in createPayment error:',
      e.response.text,
      JSON.stringify(e)
    )
    return new Response(JSON.stringify({ error: 'payment error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }

  return new Response(JSON.stringify({ success: true, msg: 'ok' }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
