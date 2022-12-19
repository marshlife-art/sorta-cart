import { assert } from 'https://deno.land/std/testing/asserts.ts'
import { description } from 'https://deno.land/x/describe/mod.ts'

import { getProductsInStock, mapSqCatalogToProducts } from './square.ts'

// note: this test takes a while:
// jest.setTimeout(120000) // 2min

Deno.test(
  description({
    name: 'square',
    given: 'getProductsInStock',
    should: 'do as expected'
  }),
  async () => {
    const catalog = await getProductsInStock()
    const products = await mapSqCatalogToProducts(catalog)

    console.log(
      'square getProductsInStock() catalog, products length:',
      catalog.length,
      products.length
    )

    if (products) {
      // import fs from 'fs'
      // import superjson from 'superjson'
      // fs.writeFileSync('catalog.json', superjson.stringify(catalog))
      // fs.writeFileSync('products.json', superjson.stringify(products))
      console.log('wrote file: catalog.json, products.json.')
    } else {
      console.warn('no stock!')
    }
    assert(products)
  }
)
