import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createPayment } from '../_shared/square/payments.ts'
import { createOrder, mapLineItems } from '../_shared/square/orders.ts'
import { supabaseServiceRoleClient } from '../_shared/supabase-admin.ts'
import {
  SuperOrderAndAssoc,
  SupaNewOrderLineItem
} from '../_shared/types/SupaTypes.ts'

async function getOrderForApiKey(api_key: string) {
  const { error, data } = await supabaseServiceRoleClient
    .from('Orders')
    .select('*, OrderLineItems ( * )')
    .eq('api_key', api_key)
    .single()

  if (error) {
    console.warn('getOrderForApiKey error!', error)
  }

  return { order: data as SuperOrderAndAssoc, error }
}

async function handleNewOrderAndPayment(
  name: string,
  total: number,
  orderLineItems: SupaNewOrderLineItem[],
  sourceId: string
): Promise<{ ok: boolean; data?: any }> {
  const lineItems = mapLineItems(orderLineItems)

  const orderResponse = await createOrder({
    referenceId: `ORDER ${Date.now()}`,
    lineItems,
    name: name
  })

  console.log(
    'square createOrder() lineItems:',
    lineItems,
    ' orderResponse:',
    orderResponse
  )

  console.log(
    'response order TOTAL:',
    orderResponse?.totalMoney?.amount?.toString(),
    ' SHOULD MATCH:',
    Math.round(total * 100)
  )

  // well it should have same result total as incoming total
  // #TODO: something meaningful if it's not (cuz the payment will fail)
  // also #TODO: handle no sourceId? like for free or pay-later orders.

  const orderId =
    orderResponse?.id &&
    orderResponse?.totalMoney?.amount?.toString() ===
      Math.round(total * 100).toString()
      ? orderResponse?.id
      : undefined

  if (orderId) {
    const amountCents = Math.round(total * 100)
    const data = await createPayment({
      sourceId,
      amountCents,
      orderId
    })

    console.log('square payment result:', data)

    return { ok: true, data }
  }

  return { ok: false }
}

async function updateOrderPayment(
  api_key: string,
  payment: { total: number; data: any }
) {
  const { error, data: order } = await supabaseServiceRoleClient
    .from('Orders')
    .update({ payment_status: 'paid' })
    .eq('api_key', api_key)
    .select()
    .single()

  if (!error && order && order.id) {
    const total = -payment.total

    const { error, data } = await supabaseServiceRoleClient
      .from('OrderLineItems')
      .insert({
        quantity: 1,
        total,
        description: 'SQUARE CARD PAYMENT',
        kind: 'payment',
        data: payment.data,
        OrderId: order.id
      })
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { api_key, sourceId } = await req.json()

    const { order, error: orderError } = await getOrderForApiKey(api_key)

    if (orderError) {
      console.warn(
        '[checkout] got error selecting order! orderError:',
        orderError
      )
      return new Response(
        JSON.stringify({ ok: false, error: ' got error selecting order!' }),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const { name, total: orderTotal, OrderLineItems } = order
    const total = orderTotal || 0

    const { ok, data } = await handleNewOrderAndPayment(
      name || 'no name',
      total,
      OrderLineItems as SupaNewOrderLineItem[],
      sourceId
    )

    if (ok && data) {
      // update order payment_status and create payment order line item.
      await updateOrderPayment(api_key, { total: total, data })

      // #TODO: send email...
      // await emailOrderReceipt(order.api_key)
    }

    return new Response(JSON.stringify({ ok: 'ok' }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    console.warn('[register] caught error:', e)
    return new Response(
      JSON.stringify({ ok: false, error: 'register error' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
