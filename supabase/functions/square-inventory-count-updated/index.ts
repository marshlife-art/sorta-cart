// note: need to use --no-verify-jwt
// supabase functions deploy square-inventory-count-updated --import-map supabase/functions/import_map.json --no-verify-jwt

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import {
  getProductsInStock,
  mapSqCatalogToProducts,
  validateWebhookSignature
} from '../_shared/square/square.ts'
import { createOrUpdateProducts } from '../_shared/supabase/products.ts'
import { InventoryCountUpdatedWebhook } from '../_shared/types/square.ts'

async function updateStockLevels(
  inventoryCountUpdatedWebhookData: InventoryCountUpdatedWebhook
) {
  const inventory_counts =
    inventoryCountUpdatedWebhookData.data.object.inventory_counts || []
  const catalogObjectIds = inventory_counts.reduce((acc, c) => {
    if (c.catalog_object_type === 'ITEM_VARIATION' && c.state === 'IN_STOCK') {
      acc.push(c.catalog_object_id)
    }
    return acc
  }, [] as string[])

  if (catalogObjectIds.length === 0) {
    console.log(
      'updateStockLevels catalogObjectIds empty (i guess no ITEM_VARIATION types??), returning...'
    )
    return
  }

  const catalog = await getProductsInStock(catalogObjectIds)
  const products = await mapSqCatalogToProducts(catalog)

  if (products.length) {
    console.log({
      message: `updateStockLevels gonna try to createOrUpdateProducts ${products.length} products (from catalogObjectIds.length: ${catalogObjectIds.length}) to db...`,
      data: JSON.stringify({ products, inventoryCountUpdatedWebhookData })
    })
    await createOrUpdateProducts(products)
  } else {
    console.log('getProductsInStock() length is not 1!')
  }
}

serve(async (req) => {
  const reqBody = await req.text()
  // const url = `https://${req.headers.get('host')}${req.url}`
  const url =
    'https://zlzhojhgkapokbmvokzz.functions.supabase.co/square-inventory-count-updated'
  const signature = `${req.headers.get('x-square-signature')}`

  console.log('new inventory-count-updated request!', {
    reqBody,
    url,
    signature
  })

  if (validateWebhookSignature({ reqBody, url, signature })) {
    // process request and try to add stock
    // data > object > inventory_counts
    /*"catalog_object_id": "PQ45SJVXHXJHXWZQCN2RPHCY",
          "catalog_object_type": "ITEM_VARIATION",
          "location_id": "D2MV0BZC6EV9Y",
          "quantity": "56",*/

    const inventoryCountUpdatedWebhookData = JSON.parse(
      reqBody
    ) as InventoryCountUpdatedWebhook

    await updateStockLevels(inventoryCountUpdatedWebhookData)
  } else {
    console.warn('unable to validate webhook signature!')
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
