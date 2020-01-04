export interface Product {
  id: number
  unf?: string
  upc_code?: string
  category: string
  sub_category: string
  name: string
  description: string
  pk: number
  size: string
  unit_type: string
  ws_price: string
  u_price: string
  ws_price_cost: string
  u_price_cost: string
  codes?: string
  import_tag?: string
  vendor: string
  createdAt?: string
  updatedAt?: string
}

interface LineItemProps {
  product_id: number
  quantity: number
  selected_unit: string
  total: number

  // id?: string
  description?: string
  price?: number
  kind?: string
  vendor?: string
  WholesaleOrderId?: number
  OrderId?: number
  data?: { product?: Product }
}

export type LineItem = Product & LineItemProps
