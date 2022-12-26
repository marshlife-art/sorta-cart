import {
  getProductsInStock,
  mapSqCatalogToProducts
} from '../functions/_shared/square/square.ts'
import superjson from 'npm:superjson'

const catalog = await getProductsInStock()
const products = await mapSqCatalogToProducts(catalog)

console.log(
  'square getProductsInStock() catalog, products length:',
  catalog.length,
  products.length
)

if (products) {
  await Deno.writeTextFile('./catalog.json', superjson.stringify(catalog))
  await Deno.writeTextFile('./products.json', superjson.stringify(products))
  console.log('wrote file: catalog.json, products.json.')
} else {
  console.warn('no stock!')
}

Deno.exit()

// make sure to add import dotenv load to _shared/square files accordingly:
// import 'https://deno.land/x/dotenv/load.ts'
// then, run like:
// deno run --allow-env --allow-read --allow-write --allow-net supabase/cli/square-cli.ts
