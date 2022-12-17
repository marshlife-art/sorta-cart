import {
  SupaCatmap,
  SupaProduct,
  SupaWholesaleOrder
} from '../../types/SupaTypes'
import { PostgrestError } from '@supabase/supabase-js'

/*
 * products
 */
export interface UpdateNoBackorder {
  (prevImportTag: string, column?: 'import_tag' | 'vendor'): Promise<{
    error: PostgrestError | null
  }>
}
export interface UpsertProducts {
  (products: SupaProduct[], ignoreDuplicates: boolean): Promise<{
    error: PostgrestError | null
    count: number | null
  }>
}
export interface DeleteProducts {
  (ids: string[]): Promise<{
    error: PostgrestError | null
  }>
}

export interface UpdateProducts {
  (product: Partial<SupaProduct>, ids: string[]): Promise<{
    error: PostgrestError | null
  }>
}

/*
 * Members
 */
export interface DeleteMember {
  (id: number): Promise<{
    error: PostgrestError | null
  }>
}

export interface UpsertMember {
  (member: Partial<SupaMember>): Promise<{
    error: PostgrestError | null
  }>
}

/*
 * catmap
 */

export interface UpsertCatmap {
  (catmap: SupaCatmap[]): Promise<{
    error: PostgrestError | null
    count: number | null
  }>
}

export interface DeleteCatmap {
  (from: string): Promise<{
    error: PostgrestError | null
  }>
}

/*
 * Orders
 */
export interface UpdateOrderStatus {
  (status: string, ids: number[]): Promise<{
    error: PostgrestError | null
  }>
}
export interface UpdateOrderShipmentStatus {
  (status: string, ids: number[]): Promise<{
    error: PostgrestError | null
  }>
}
export interface DeleteOrders {
  (ids: number[]): Promise<{
    error: PostgrestError | null
  }>
}

/*
 * WholesaleOrders
 */
export interface InsertWholesaleOrder {
  (wholesaleOrder: Partial<SupaWholesaleOrder>): Promise<{
    data: SupaWholesaleOrder | null
    error: PostgrestError | null
  }>
}

export interface DeleteWholesaleOrder {
  (id: number): Promise<{
    error: PostgrestError | null
  }>
}

export interface UpsertWholesaleOrder {
  (wholesaleOrder: Partial<SupaWholesaleOrder>): Promise<{
    data: SupaWholesaleOrder | null
    error: PostgrestError | null
  }>
}

/*
 * OrderLineItems
 */
export interface UpdateOrderLineItems {
  (orderLineItems: Partial<SupaOrderLineItem>, ids: number[]): Promise<{
    error: PostgrestError | null
    status: number
  }>
}
export interface InsertOrderLineItem {
  (lineItem: Partial<SupaOrderLineItem>): Promise<{
    data: any[] | null
    error: PostgrestError | null
  }>
}

// hmm, it might be useful to implement an entire object to say like, a flavour
// (like local or supabase) needs to implement these functions.
// export type ServiceMutations = UpdateNoBackorder | UpsertProducts
