import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SupaProduct } from '../_shared/types/SupaTypes.ts'
import { corsHeaders, jsonCorsHeaders } from '../_shared/cors.ts'
import { addInventory, addProductToCatalog } from '../_shared/square/square.ts'
import { supabaseServiceRoleClient } from '../_shared/supabase-admin.ts'

export interface SquareImportItem {
  name: string
  product: SupaProduct
  qty: number
  imported?: boolean
  error?: string
}

async function getSquareImportById(id: string) {
  const { error, data } = await supabaseServiceRoleClient
    .from('squareImport')
    .select()
    .eq('id', id)
    .single()

  if (error) {
    console.warn('getSquareImportById error!', error)
  }

  return { squareImport: data, error }
}

async function parseSquareImportData(items: SquareImportItem[]) {
  if (!items || !items.length) {
    return { ok: false }
  }

  // const products = items.map((item) => item.product) as Product[]

  for await (const item of items) {
    console.log(
      `zomg need to add:',
      ${item.qty}
      ' for item:'
      ${item.name}`
    )

    console.log('product:', item.product)

    const { product, qty } = item
    await addProductAndInventory(product as SupaProduct, qty)
  }

  return { ok: true }
}

async function addProductAndInventory(product: SupaProduct, qty: number) {
  if (!product) {
    console.log({
      message: `eek no product for this item`,
      level: 'warn'
    })
    return
  }
  const { result, variationId } = await addProductToCatalog(product)
  console.log({
    message: `zomg addProductToCatalog() variationId: ${variationId}`,
    result
  })
  if (variationId) {
    console.log({
      message: ` 'gonna addInventory! variationId: ${variationId}, qty: ${qty}`
    })

    const rez = await addInventory(variationId, qty)
    if (rez?.result.errors) {
      console.log({
        message: ` 'addInventory  rez.result.errors: ${rez.result.errors}`,
        level: 'warn'
      })
    }

    console.log({
      message: `addInventory rez`,
      data: JSON.stringify({ rez }),
      level: 'debug'
    })
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { id } = await req.json()

  const { squareImport, error } = await getSquareImportById(id)
  if (error || !squareImport) {
    return new Response(
      JSON.stringify({ ok: false, error: error ?? 'no record found' }),
      {
        headers: jsonCorsHeaders,
        status: 404
      }
    )
  }
  const data = squareImport.data as unknown as { items: SquareImportItem[] } // #TODO: ugh tsc :/
  await parseSquareImportData(data?.items)

  return new Response(JSON.stringify({ ok: true }), {
    headers: jsonCorsHeaders
  })
})
