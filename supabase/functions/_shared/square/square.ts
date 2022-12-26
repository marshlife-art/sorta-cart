// import 'https://deno.land/x/dotenv/load.ts'

import {
  BatchRetrieveInventoryCountsResponse,
  BatchUpsertCatalogObjectsRequest,
  CatalogCustomAttributeValue,
  CatalogObject,
  CatalogObjectBatch,
  InventoryCount,
  StandardUnitDescription
} from 'https://esm.sh/square@25.0.0'
import crypto, {
  randomUUID
} from 'https://deno.land/std@0.168.0/node/crypto.ts'
import { isDeepStrictEqual } from 'https://deno.land/std@0.168.0/node/util.ts'

import { SupaProduct } from '../../_shared/types/SupaTypes.ts'
import { client } from './client.ts'
import { getDefaultLocationId } from './locations.ts'

type CatalogObjectWithQty = CatalogObject & {
  quantity?: number
  standardUnitDescription?: StandardUnitDescription
}

const SQUARE_SIGNATURE_KEY = Deno.env.get('SQUARE_SIGNATURE_KEY') ?? ''

const { inventoryApi, catalogApi } = client

export async function batchRetrieveInventoryCounts(
  catalogObjectIds?: string[]
) {
  let cursor: string | null = ''
  let totalItems = 0
  let counts: InventoryCount[] = []

  while (cursor !== null) {
    try {
      // ugh, ts can't infer result type when it's in this while loop :/
      const { result }: { result: BatchRetrieveInventoryCountsResponse } =
        await inventoryApi.batchRetrieveInventoryCounts({
          cursor,
          catalogObjectIds
        })

      if (result.counts) {
        totalItems += result.counts.length || 0
        counts = [...counts, ...result.counts]
      }

      cursor = result.cursor ? result.cursor : null
    } catch (error) {
      console.warn('Unexpected Error: ', error)
      break
    }
  }

  return { totalItems, counts }
}

async function getMeasurementUnits(products: CatalogObjectWithQty[]) {
  try {
    const measurementUnitIds = products.reduce((acc, product) => {
      if (
        product.itemData?.variations &&
        product.itemData?.variations[0].itemVariationData?.measurementUnitId &&
        !acc.includes(
          product.itemData?.variations[0].itemVariationData?.measurementUnitId
        )
      ) {
        acc.push(
          product.itemData?.variations[0].itemVariationData?.measurementUnitId
        )
      }
      return acc
    }, [] as string[])

    const { result: measurementUnitsResult } =
      await catalogApi.batchRetrieveCatalogObjects({
        objectIds: measurementUnitIds
      })

    return measurementUnitsResult
  } catch (e) {
    // console.warn('getMeasurementUnits caught error!', e)
    return null
  }
}

function addQuantity(
  products: CatalogObjectWithQty[],
  counts: InventoryCount[]
) {
  return products.map((product) => {
    // so finally back-reference all the inventory counts with each product item varation
    const quantity = product.itemData?.variations?.reduce((acc, v) => {
      const quantity = counts.find((c) => c.catalogObjectId === v.id)?.quantity
      if (!isNaN(parseFloat(`${quantity}`))) {
        acc += parseFloat(`${quantity}`)
      }
      return acc
    }, 0)
    return { ...product, quantity }
  })
}

export async function addStandardUnitDescription(
  products: CatalogObjectWithQty[]
) {
  const { result: catalogInfoResult } = await catalogApi.catalogInfo()
  const standardUnitDescriptions =
    catalogInfoResult.standardUnitDescriptionGroup?.standardUnitDescriptions ||
    []
  const measurementUnitsResult = await getMeasurementUnits(products)

  return products.map((product) => {
    // finally get a lookup table for measurementUnitId
    // so first need to get catalog info (which does have the limits that could inform chunk thing above) ANYWAY
    // standard_unit_description_group > standard_unit_descriptions > {
    //   "unit": {
    //     "weight_unit": "IMPERIAL_WEIGHT_OUNCE",
    //     "type": "TYPE_WEIGHT"
    //   },
    //   "name": "Ounce",
    //   "abbreviation": "oz"
    // }
    // ...okay then when we lookup measurementUnitId (ex AA5LSZVBOTT64UQXCQ6NHF7V) in the catalog we'll get a "type": "MEASUREMENT_UNIT",
    //  measurement_unit_data > weight_unit
    // :/

    let standardUnitDescription: StandardUnitDescription | undefined

    if (
      product.itemData?.variations &&
      product.itemData?.variations[0].itemVariationData?.measurementUnitId
    ) {
      const measurementUnitId =
        product.itemData.variations[0].itemVariationData.measurementUnitId
      const measurementUnitObject = measurementUnitsResult?.objects?.find(
        (o) => o.id === measurementUnitId
      )
      if (measurementUnitObject) {
        standardUnitDescription = standardUnitDescriptions.find((u) =>
          isDeepStrictEqual(
            u.unit,
            measurementUnitObject.measurementUnitData?.measurementUnit
          )
        )
      }
    }

    return { ...product, standardUnitDescription }
  })
}

export async function getProductsInStock(
  catalogObjectIds?: string[]
): Promise<CatalogObjectWithQty[]> {
  // console.log(
  //   `[getProductsInStock] starting. have ${
  //     catalogObjectIds && catalogObjectIds.length
  //   } catalogObjectIds`
  // )
  const { counts } = await batchRetrieveInventoryCounts(catalogObjectIds)

  const objectIds = counts
    .filter((c) => parseFloat(`${c.quantity}`))
    .reduce((acc, count) => {
      const catalogObjectId = count.catalogObjectId || ''
      if (catalogObjectId && count.state === 'IN_STOCK') {
        acc.push(catalogObjectId)
      }
      return acc
    }, [] as string[])

  if (!objectIds || objectIds.length === 0) {
    console.warn('no products found in square! gonna return')
    return []
  }
  // console.log('[getProductsInStock] objectIds.length:', objectIds.length)
  // console.log(
  //   '[getProductsInStock] objectIds:',
  //   objectIds,
  //   ' counts:',
  //   JSON.stringify(counts)
  // )

  let products: CatalogObjectWithQty[] = []

  const perChunk = 100 // items per chunk

  const chunkedObjectIds = objectIds.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / perChunk)
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [] // start a new chunk
    }
    acc[chunkIndex].push(item)
    return acc
  }, [] as string[][])

  for await (const objectIds of chunkedObjectIds) {
    try {
      const { result: variationsResult } =
        await catalogApi.batchRetrieveCatalogObjects({
          objectIds
        })

      if (variationsResult.objects) {
        // so variations are "type": "ITEM_VARIATION"
        const { result } = await catalogApi.batchRetrieveCatalogObjects({
          // reduce here to handle optionalz
          objectIds: variationsResult.objects.reduce((acc, v) => {
            if (v.itemVariationData?.itemId) {
              acc.push(v.itemVariationData.itemId)
            }
            return acc
          }, [] as string[])
        })

        if (result.objects) {
          products = [...products, ...result.objects]
        }
      }
    } catch (e) {
      console.warn(
        'onoz! getProductsInStock batchRetrieveCatalogObjects caugher error:',
        e
      )
    }
  }

  // might be better expressed kinda like: addQuantity(products, counts).addStandardUnitDescription(products)
  return addStandardUnitDescription(
    addQuantity(
      products,
      counts.filter((c) => c.state === 'IN_STOCK')
    )
  )
}

interface CustomAttributeValues {
  [index: string]: string | number | undefined
}
function mapCustomAttributes(product: CatalogObjectWithQty) {
  if (product.itemData?.variations && product.itemData.variations[0]) {
    const variation = product.itemData.variations[0]
    if (variation.customAttributeValues) {
      return Object.values(variation.customAttributeValues).reduce(
        (acc, cav) => {
          const { name, type } = cav
          if (!name) {
            return acc
          }
          let value: string | number | undefined
          if (type === 'STRING') {
            value = cav.stringValue ?? undefined
          } else if (type === 'NUMBER') {
            value = Number(cav.numberValue)
          }
          acc[name] = value
          return acc
        },
        {} as CustomAttributeValues
      )
    }
  }
  return null
}

function getIdFromCAVorSKU(
  cav: CustomAttributeValues | null,
  sku?: string | null
): string {
  if (cav?.id) {
    return `${cav.id}`
  }
  if (cav?.unf && cav?.upc_code) {
    return `${cav.unf}__${`${cav.upc_code}`.replace(/-/g, '')}`
  }
  if (sku) {
    return `__${sku}`
  }
  return '' // eek :/
}

function parseNameAndDesc(item: CatalogObjectWithQty): {
  name?: string
  description_orig?: string
} {
  if (item.itemData?.name && item.itemData.name.includes('--')) {
    const [name, description] = item.itemData.name.split('--')
    return { name: name.trim(), description_orig: description.trim() }
  }
  const name = item.itemData?.name ?? undefined
  const description = item.itemData?.description
  if (!description || !isNaN(parseInt(description))) {
    // so if there's no description, or the description is numbers, then return the name as description.
    return { name: undefined, description_orig: name }
  }
  return { name, description_orig: description }
}

async function parseCategory(item: CatalogObjectWithQty): Promise<{
  category?: string
  sub_category?: string
}> {
  if (item.itemData?.categoryId) {
    console.log('zomg have categoryId')
    const res = await catalogApi.retrieveCatalogObject(item.itemData.categoryId)
    if (res.result.object?.categoryData?.name) {
      const cat = res.result.object?.categoryData?.name
      if (cat.includes('>')) {
        const [category, sub_category] = cat.split('>')
        return {
          category: category.trim(),
          sub_category: sub_category.trim()
        }
      }
      return { category: cat }
    } else {
      return { category: undefined, sub_category: undefined }
    }
  }

  return { category: undefined, sub_category: undefined }
}

export async function mapSqCatalogToProducts(
  catalog: CatalogObjectWithQty[]
): Promise<SupaProduct[]> {
  const catalogMap = catalog.map(async (item) => {
    const priceMaybeBigInt =
      (item.itemData &&
        item.itemData.variations &&
        item.itemData?.variations[0].itemVariationData?.priceMoney?.amount) ||
      0
    const u_price = +(parseInt(`${priceMaybeBigInt}`) / 100).toFixed(2) // oh money numberz
    const unit_type = `${item.standardUnitDescription?.name || 'EA'}`
    const sku =
      item.itemData?.variations &&
      item.itemData.variations[0].itemVariationData?.sku
    const variation_id =
      (item.itemData?.variations && item.itemData.variations[0].id) || ''

    // customAttributeValues
    const cav = mapCustomAttributes(item)
    const id = getIdFromCAVorSKU(cav, sku)

    const { category, sub_category } = await parseCategory(item)

    const product: Partial<SupaProduct> = {
      id,
      ...parseNameAndDesc(item),
      u_price,
      unit_type,
      count_on_hand: item.quantity,
      sq_variation_id: variation_id,
      ...cav
    }
    if (category) product.category = category
    if (sub_category) product.sub_category = sub_category
    if (sku) product.upc_code = sku
    return product as SupaProduct // ugh! #TODO: deal with `as Product`
  })
  return await Promise.all(catalogMap)
}

export async function batchRetrieveCatalogObjects(objectIds: string[]) {
  try {
    const { result } = await catalogApi.batchRetrieveCatalogObjects({
      objectIds
    })
    return result
  } catch (e) {
    console.warn(
      'batchRetrieveCatalogObjects returned error:',
      batchRetrieveCatalogObjects
    )
    return null
  }
}

export function validateWebhookSignature(props: {
  reqBody: string
  url: string
  signature: string
}) {
  // example:
  // const body = JSON.stringify(req.body);
  // const signature = req.header('x-square-signature');
  // const url = `https://${req.headers.host}${req.url}`
  const { reqBody, url, signature } = props

  // concat notification URL and JSON body of the webhook notification
  const combined = url + reqBody

  // generate HMAC-SHA1 signature of the string
  // signed with webhook signature key
  // webhook subscription signature key defined on developer.squareup.com
  const hmac = crypto.createHmac('sha1', SQUARE_SIGNATURE_KEY)
  hmac.write(combined)
  hmac.end()
  const checkHash = hmac.read().toString('base64')

  // #TODO: DEBUG?
  // console.log(
  //   '[validateWebhookSignature] props:',
  //   props,
  //   // ' checkHash:',
  //   // checkHash,
  //   // ' signature:',
  //   // signature,
  //   'success:',
  //   checkHash === signature
  // )

  return checkHash === signature
}

/*
 * adding products to catalog
 *
 * all the stuff below relates to creating or updating products,
 * as well as stocking those items' inventory.
 * the idea here is to go from a wholesale order -> square inventory.
 * currently not planning on putting every supabase product into the square catalog
 * so we just create them only when there's inventory received (via a wholesale order).
 */

// #TODO: figure out when deleting items is needed...
// async function batchDeleteCatalogObjects(objectIds: string[]) {
//   return await catalogApi.batchDeleteCatalogObjects({ objectIds })
// }

async function fetchCustomAttributes() {
  // #TODO cache result in global var
  return await catalogApi.searchCatalogObjects({
    objectTypes: ['CUSTOM_ATTRIBUTE_DEFINITION']
  })
}

async function fetchTaxes() {
  return await catalogApi.searchCatalogObjects({
    objectTypes: ['TAX']
  })
}

async function fetchMeasurementUnits() {
  // #TODO cache result in global var
  return await catalogApi.searchCatalogObjects({
    objectTypes: ['MEASUREMENT_UNIT']
  })
}

function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}

type CatalogCustomAttributeValues = Record<string, CatalogCustomAttributeValue>

async function mapProductToCustomAttributeValues(product: SupaProduct) {
  const {
    result: { objects }
  } = await fetchCustomAttributes()
  // console.log('fetchCustomAttributes result objects:', objects)

  if (!objects) {
    return {}
  }
  return objects.reduce((acc, object) => {
    const { customAttributeDefinitionData, id: customAttributeDefinitionId } =
      object
    if (customAttributeDefinitionData?.key) {
      const { key, name, type } = customAttributeDefinitionData
      if (!hasOwnProperty(product, name)) {
        return acc
      }

      acc[key] = {
        key,
        customAttributeDefinitionId,
        name,
        type,
        [type === 'NUMBER' ? 'numberValue' : 'stringValue']: String(
          product[name]
        )
      }
    }

    return acc
  }, {} as CatalogCustomAttributeValues)
}

async function getMeasurementUnitId(product?: SupaProduct) {
  if (!product || !product.plu || !product.size) {
    return undefined
  }

  const {
    result: { objects }
  } = await fetchMeasurementUnits()
  // console.log(
  //   'fetchMeasurementUnitsResult.result.objects:',
  //   objects
  //   // superjson.stringify(fetchMeasurementUnitsResult.result)
  // )

  // IMPERIAL_WEIGHT_OUNCE | IMPERIAL_POUND ..any others needed?
  if (product.size.match(/oz/i)) {
    return objects?.find(
      (o) =>
        o.measurementUnitData?.measurementUnit?.weightUnit ===
        'IMPERIAL_WEIGHT_OUNCE'
    )?.id
  }
  if (product.size.match(/lb/i)) {
    return objects?.find(
      (o) =>
        o.measurementUnitData?.measurementUnit?.weightUnit === 'IMPERIAL_POUND'
    )?.id
  }
}

async function searchCatalogForIdCustomAttribute(stringFilter: string) {
  const {
    result: { objects }
  } = await fetchCustomAttributes()
  // console.log('fetchCustomAttributes result objects:', objects)

  if (!objects) {
    throw new Error('onoz! no custom attributes found!')
  }

  const customAttributeDefinitionId = objects.find(
    (o) => o.customAttributeDefinitionData?.name === 'id'
  )?.id

  if (!customAttributeDefinitionId) {
    throw new Error(
      'onoz! customAttributeDefinitionId for id custom attribute not found!'
    )
  }

  return await catalogApi.searchCatalogItems({
    customAttributeFilters: [{ customAttributeDefinitionId, stringFilter }]
  })
}

async function getCategoryId(
  category?: string | null,
  sub_category?: string | null
) {
  let cat: string | undefined
  if (!category && sub_category) {
    cat = sub_category
  } else if (!sub_category && category) {
    cat = category
  } else {
    cat = `${category} > ${sub_category}`
  }
  if (!cat) {
    return undefined
  }
  const {
    result: { errors, objects }
  } = await catalogApi.searchCatalogObjects({
    objectTypes: ['CATEGORY'],
    query: {
      exactQuery: {
        attributeName: 'name',
        attributeValue: cat
      }
    }
  })

  if (objects && objects[0].id) {
    return objects[0].id
  }

  const {
    result: { catalogObject }
  } = await catalogApi.upsertCatalogObject({
    idempotencyKey: randomUUID(),
    object: {
      type: 'CATEGORY',
      id: '#new',
      categoryData: {
        name: cat
      }
    }
  })

  if (catalogObject?.id) {
    return catalogObject.id
  } else {
    console.warn('[getCategoryId] i guess could not create new category :/')
  }
  return undefined
}

export async function addProductToCatalog(product: SupaProduct) {
  const {
    result: { objects }
  } = await fetchTaxes()
  const taxIds = objects?.map((o) => o.id)

  // #TODO map products?
  // const product = products[0]

  if (product.u_price === undefined) {
    throw new Error('onoz! product.u_price is undefined')
  }

  // ! ! ! ! ! !
  // zomg, should probably just track square_item_id and square_variation_id
  // on the product record to avoid having to do searchCatalogForIdCustomAttribute
  // ! ! ! ! ! !

  const {
    result: { items }
  } = await searchCatalogForIdCustomAttribute(product.id)

  // so if the product exists, need to pass the item and variation id in the request
  // note: if doesn't exist, prefix id with # to indicate new product
  // the point of the # is that it can be referenced by other objects in the same batch request.
  // ...might be that undefined is fine for new products??
  const itemId = (items && items[0] && items[0].id) || `#${product.id}`
  const variationId =
    (items &&
      items[0] &&
      items[0].itemData?.variations &&
      items[0].itemData?.variations[0].id) ||
    `#VARIATION${product.id}`
  // when updating existing square catalog items need to send along version
  const itemVersion = items && items[0] && items[0].version
  const variationVerson =
    items &&
    items[0] &&
    items[0].itemData?.variations &&
    items[0].itemData?.variations[0].version

  const customAttributeValues = await mapProductToCustomAttributeValues(product)
  const measurementUnitId = await getMeasurementUnitId(product)
  const categoryId = await getCategoryId(product.category, product.sub_category)
  const name = `${product.name} -- ${product.description}`
  const amount = toCents(product.u_price)
  const sku = product.plu ? product.plu : product.upc_code

  /*
   * hmm, not sure if storing upc in square catalog is useful for anything?
   * ...it might be that the square POS register's bar code scanner will look at
   * product's sku (and not upc); dunno for sure.
   * #TODO: figure out if this is needed, if not, yank it.
   *
   * from square api docz:
   * The universal product code (UPC) of the item variation, if any.
   * This is a searchable attribute for use in applicable query filters.
   *
   * The value of this attribute should be a number of 12-14 digits long.
   * This restriction is enforced on the Square Seller Dashboard, Square Point of Sale
   * or Retail Point of Sale apps, where this attribute shows in the GTIN field.
   * If a non-compliant UPC value is assigned to this attribute using the API,
   * the value is not editable on the Seller Dashboard, Square Point of Sale
   * or Retail Point of Sale apps unless it is updated to fit the expected format.
   */
  const upc_code = product.upc_code?.replace(/-/g, '')
  const upc =
    upc_code && upc_code.length > 11 && upc_code.length < 15
      ? upc_code
      : undefined

  // #TODO get a category id or create a new category if it doesn't exist.

  const batches: CatalogObjectBatch[] = [
    {
      objects: [
        {
          id: itemId,
          version: itemVersion,
          type: 'ITEM',
          itemData: {
            name,
            taxIds,
            categoryId,
            variations: [
              {
                id: variationId,
                version: variationVerson ?? undefined,
                type: 'ITEM_VARIATION',
                customAttributeValues,
                itemVariationData: {
                  measurementUnitId,
                  name,
                  sku,
                  upc,
                  pricingType: 'FIXED_PRICING',
                  priceMoney: {
                    amount,
                    currency: 'USD'
                  },
                  inventoryAlertThreshold: BigInt(1),
                  inventoryAlertType: 'LOW_QUANTITY'
                }
              }
            ]
          }
        }
      ]
    }
  ]

  const req: BatchUpsertCatalogObjectsRequest = {
    idempotencyKey: randomUUID(),
    batches
  }

  // console.log('[square] batchUpsertCatalogObjects req:', req)

  const result = await catalogApi.batchUpsertCatalogObjects(req)
  return { result, variationId }
}

export async function addInventory(variationId: string, qty: number) {
  const locationId = await getDefaultLocationId()

  const quantity = `${qty}`

  const body = {
    ignoreUnchangedCounts: true,
    changes: [
      {
        type: 'ADJUSTMENT',
        adjustment: {
          catalogObjectId: variationId,
          quantity,
          fromState: 'NONE',
          toState: 'IN_STOCK',
          locationId,
          occurredAt: new Date().toISOString()
        }
      }
    ],
    idempotencyKey: randomUUID()
  }
  console.log('gonna batchChangeInventory!!! body:', body)
  try {
    return await inventoryApi.batchChangeInventory(body)
  } catch (e) {
    console.warn('zomg batchChangeInventory caught error:', e)
    return undefined
  }
}

function toMoney(input: any) {
  if (isNaN(parseFloat(input))) {
    return 0
  }
  return +parseFloat(input).toFixed(2)
}
function toCents(input: any) {
  return BigInt(Math.round(toMoney(input) * 100))
}
