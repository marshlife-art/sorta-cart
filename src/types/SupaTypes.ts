import { Database, Json } from './supabase'

export type User = {
  email?: string
  role?: string
}
export type SupaProduct = Database['public']['Tables']['products']['Row']
export type SupaMember = Database['public']['Tables']['Members']['Row']
export type SupaUser = {
  id?: string
  email?: string
  role?: string
  app_metadata?: { [key: string]: any }
} // hmm, figure this out.
export type SupaMemberWithUser = SupaMember & { User?: SupaUser | null }
export type SupaNewOrderLineItem = Omit<SupaOrderLineItem, 'id'> & {
  data: SupaOrderLineItemData
}
export type SupaOrderLineItemData = {
  product?: SupaProduct
  payment?: { receipt_url: string; receipt_number: string }
}
export type SupaOrderLineItem = Omit<
  Database['public']['Tables']['OrderLineItems']['Row'],
  'id' | 'data'
> & {
  id?: number
  data?: SupaOrderLineItemData | null
}
export type SupaOrder = Database['public']['Tables']['Orders']['Row']
export type SupaOrderWithLineItems = SupaOrder & {
  OrderLineItems?: SupaOrderLineItem[] | null
}
export type SupaOrderWithMembers = SupaOrder & {
  Members?: SupaMember
}
export type SuperOrderAndAssoc = SupaOrder & {
  OrderLineItems?: SupaOrderLineItem[] | null
  Members?: SupaMember | null
  User?: User | null
}

export type PartialSuperOrderAndAssoc = Partial<SupaOrder> & {
  OrderLineItems?: Partial<SupaOrderLineItem>[] | null
  Members?: Partial<SupaMember> | null
  User?: Partial<User> | null
}

type WholesaleOrder = Database['public']['Tables']['WholesaleOrders']['Row']
export type SupaWholesaleOrder = Omit<WholesaleOrder, 'id' | 'api_key'> & {
  id?: number
  api_key?: string
  OrderLineItems?: SupaOrderLineItem[] | null
  data?: Json
}

export type SupaCatmap = Database['public']['Tables']['catmap']['Row']
