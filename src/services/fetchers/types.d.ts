import { Query } from 'material-table'
import {
  SupaCatmap,
  SupaProduct,
  SupaMember,
  SupaMemberWithUser,
  SupaWholesaleOrder,
  SupaOrder,
  SuperOrderAndAssoc,
  SupaOrderLineItem
} from '../../types/SupaTypes'
import { PostgrestError } from '@supabase/supabase-js'

export interface ProductFetcher {
  (id: string): Promise<{
    data: SupaProduct | null
    error: PostgrestError | null
  }>
}
export interface ProductsFetcher {
  (q: Query<SupaProduct>): Promise<{
    data: SupaProduct[] | null
    error: PostgrestError | null
    count: number | null
  }>
}
export interface DistinctProductVendorsFetcher {
  (): Promise<string[]>
}
export interface DistinctProductImportTagsFetcher {
  (): Promise<string[]>
}
export interface DistinctProductCategoriesFetcher {
  (): Promise<{ [index: string]: string }>
}
export interface DistinctProductSubCategoriesFetcher {
  (category: string): Promise<{ [index: string]: string }>
}
export interface ProductOption {
  name: string
  product: SupaProduct
}
export interface ProductsAutocompleteFetcher {
  (props: { key: string; q: string }): Promise<ProductOption[]>
}
export interface CatmapFetcher {
  (): Promise<{
    data: SupaCatmap[] | null
    error: PostgrestError | null
    count: number | null
  }>
}
export interface MemberOption {
  name: string
  member: SupaMemberWithUser
}
export interface MembersAutocompleteFetcher {
  (props: { key: string; q: string }): Promise<MemberOption[]>
}
export interface MembersFetcher {
  (q: Query<SupaMember>): Promise<{
    data: SupaMember[] | null
    error: PostgrestError | null
    count: number | null
  }>
}
export interface MemberDashboardFetcher {
  (): Promise<{
    data: SupaMember[] | null
    error: PostgrestError | null
    count: number | null
  }>
}
export interface MemberFetcher {
  (memberId: number): Promise<{
    data: SupaMember | null
    error: PostgrestError | null
  }>
}

export interface OrderDashboardFetcher {
  (): Promise<{
    data: SupaOrder[] | null
    error: PostgrestError | null
  }>
}
export interface OrdersForMember {
  (MemberId: number): Promise<{
    data: SupaOrder[] | null
    error: PostgrestError | null
  }>
}
export interface OrderFetcher {
  (id: number): Promise<{
    data: SuperOrderAndAssoc | null
    error: PostgrestError | null
  }>
}
export interface OrderDataTableFetcher {
  (q: Query<SuperOrderAndAssoc>): Promise<{
    data: SuperOrderAndAssoc[] | null
    error: PostgrestError | null
    count: number | null
  }>
}

export interface WholesaleOrdersFetcher {
  (status: OrderStatus): Promise<{
    data: SupaWholesaleOrder[] | null
    error: PostgrestError | null
    count: number | null
  }>
}

export interface WholesaleOrderFetcher {
  (id: number): Promise<{
    data: SupaWholesaleOrder | null
    error: PostgrestError | null
  }>
}

export interface WholesaleOrderDashboardFetcher {
  (): Promise<{
    data: SupaWholesaleOrder[] | null
    error: PostgrestError | null
  }>
}

export interface WholesaleOrdersDataTableFetcher {
  (q: Query<SupaOrderLineItem> | Query<SupaWholesaleOrder>): Promise<{
    data: SupaOrderLineItem[] | null
    error: PostgrestError | null
    count: number | null
  }>
}

export interface WholesaleOrderLineItemsFetcher {
  (): Promise<{
    data: SupaOrderLineItem[]
    error: PostgrestError | null
    count: number | null
  }>
}
