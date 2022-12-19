export interface Product {
  id: any // ;(
  unf?: string
  upc_code?: string
  category: string
  sub_category: string
  name: string
  description: string
  pk: number
  size: string
  unit_type: string
  ws_price: any // ;(
  u_price: any // ;(
  ws_price_cost?: any // ;(
  u_price_cost?: any // ;(
  codes?: string
  import_tag?: string
  vendor: string
  createdAt?: string
  updatedAt?: string
  count_on_hand?: number
  no_backorder?: boolean
  sq_variation_id?: string
  plu?: string
}

// interface LineItemProps {
//   product_id: number
//   quantity: number
//   selected_unit: string
//   total: number

//   // id?: string
//   description?: string
//   price?: number
//   kind?: string
//   vendor?: string
//   WholesaleOrderId?: number
//   OrderId?: number
//   data?: { product?: Product }
// }

// export type LineItem = Product & LineItemProps
