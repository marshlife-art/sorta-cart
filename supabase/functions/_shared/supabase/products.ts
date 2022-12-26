import { supabaseServiceRoleClient } from '../supabase-admin.ts'
import { SupaProduct } from '../types/SupaTypes.ts'

export async function createOrUpdateProducts(products: SupaProduct[]) {
  const c = supabaseServiceRoleClient

  let createdProducts = 0
  let updatedProducts = 0

  for await (const product of products) {
    const { count: productCount } = await c
      .from('products')
      .select('id', { count: 'exact' })
      .eq('id', product.id)
    if (productCount) {
      // product exists, just update a couple properties
      const { count_on_hand, sq_variation_id } = product
      const { error } = await c
        .from('products')
        .update({ count_on_hand, sq_variation_id })
        .eq('id', product.id)
      if (error) {
        console.log({
          tag: 'createOrUpdateProducts',
          message: `update error: ${error.message})`,
          level: 'error',
          data: JSON.stringify({ error })
        })
      } else {
        updatedProducts += 1
      }
    } else {
      const { error } = await c.from('products').insert(product)
      if (error) {
        console.log({
          tag: 'createOrUpdateProducts',
          message: `insert error: ${error.message})`,
          level: 'error',
          data: JSON.stringify({ error })
        })
      } else {
        createdProducts += 1
      }
    }
  }

  console.log({
    tag: 'createOrUpdateProducts',
    message: `createOrUpdateProducts result createdProducts: ${createdProducts}, updatedProducts: ${updatedProducts}`
  })
}
