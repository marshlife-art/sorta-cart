import {
  productFetcher as supaProductFetcher,
  productsFetcher as supaProductsFetcher,
  distinctProductVendors as supaDistinctProductVendors,
  distinctProductImportTags as supaDistinctProductImportTags,
  productsAutocompleteFetcher as supaProductsAutocompleteFetcher,
  distinctProductCategories as supaDistinctProductCategories,
  distinctProductSubCategories as supaDistinctProductSubCategories
} from './supabase/products'
import { catmapFetcher as supaCatmapFetcher } from './supabase/catmap'
import {
  membersAutocompleteFetcher as supaMembersAutocompleteFetcher,
  membersFetcher as supaMembersFetcher,
  membersDashboardFetcher as supaMembersDashboardFetcher,
  memberFetcher as supaMemberFetcher
} from './supabase/members'
import {
  ordersDashboardFetcher as supaOrdersDashboardFetcher,
  ordersForMember as supaOrdersForMember,
  orderFetcher as supaOrderFetcher,
  ordersDataTableFetcher as supaOrdersDataTableFetcher
} from './supabase/orders'
import {
  wholesaleOrdersFetcher as supaWholesaleOrdersFetcher,
  wholesaleOrderFetcher as supaWholesaleOrderFetcher,
  wholesaleOrdersDashboardFetcher as supaWholesaleOrdersDashboardFetcher,
  wholesaleOrdersDataTableFetcher as supaWholesaleOrdersDataTableFetcher,
  wholesaleOrderLineItemsFetcher as supaWholesaleOrderLineItemsFetcher
} from './supabase/wholesaleorders'

import {
  productFetcher as localProductFetcher,
  productsFetcher as localProductsFetcher,
  distinctProductVendors as localDistinctProductVendors,
  distinctProductImportTags as localDistinctProductImportTags,
  productsAutocompleteFetcher as localProductsAutocompleteFetcher,
  distinctProductCategories as localDistinctProductCategories,
  distinctProductSubCategories as localDistinctProductSubCategories
} from './local/products'
import { catmapFetcher as localCatmapFetcher } from './local/catmap'
import {
  membersAutocompleteFetcher as localMembersAutocompleteFetcher,
  membersFetcher as localMembersFetcher,
  membersDashboardFetcher as localMembersDashboardFetcher,
  memberFetcher as localMemberFetcher
} from './local/members'
import {
  ordersDashboardFetcher as localOrdersDashboardFetcher,
  ordersForMember as localOrdersForMember,
  orderFetcher as localOrderFetcher,
  ordersDataTableFetcher as localOrdersDataTableFetcher
} from './local/orders'
import {
  wholesaleOrdersFetcher as localWholesaleOrdersFetcher,
  wholesaleOrderFetcher as localWholesaleOrderFetcher,
  wholesaleOrdersDashboardFetcher as localWholesaleOrdersDashboardFetcher,
  wholesaleOrdersDataTableFetcher as localWholesaleOrdersDataTableFetcher,
  wholesaleOrderLineItemsFetcher as localWholesaleOrderLineItemsFetcher
} from './local/wholesaleorders'

// hmm this all is maybe kinda repetive, there's prolly a better way to do this :/
// ...trying to avoid class, tho :\
// function serviceSwitch(local, supa){
//   return process.env.USE_LOCAL_SERVICES ? local : supa
// }
// i think these exports have to be any?
// import * as supaProductFetchers from './supabase/products'
// import * as localProductFetchers from './local/products'
// export const productFetchers = process.env.USE_LOCAL_SERVICES ? localProductFetchers : supaProductFetchers

/*
 * Products
 */
export const productFetcher = process.env.USE_LOCAL_SERVICES
  ? localProductFetcher
  : supaProductFetcher

export const productsFetcher = process.env.USE_LOCAL_SERVICES
  ? localProductsFetcher
  : supaProductsFetcher

export const distinctProductVendors = process.env.USE_LOCAL_SERVICES
  ? localDistinctProductVendors
  : supaDistinctProductVendors

export const distinctProductImportTags = process.env.USE_LOCAL_SERVICES
  ? localDistinctProductImportTags
  : supaDistinctProductImportTags

export const distinctProductCategories = process.env.USE_LOCAL_SERVICES
  ? localDistinctProductCategories
  : supaDistinctProductCategories

export const distinctProductSubCategories = process.env.USE_LOCAL_SERVICES
  ? localDistinctProductSubCategories
  : supaDistinctProductSubCategories

export const productsAutocompleteFetcher = process.env.USE_LOCAL_SERVICES
  ? localProductsAutocompleteFetcher
  : supaProductsAutocompleteFetcher

/*
 * Catmap
 */
export const catmapFetcher = process.env.USE_LOCAL_SERVICES
  ? localCatmapFetcher
  : supaCatmapFetcher

/*
 * Members
 */
export const membersAutocompleteFetcher = process.env.USE_LOCAL_SERVICES
  ? localMembersAutocompleteFetcher
  : supaMembersAutocompleteFetcher

export const membersFetcher = process.env.USE_LOCAL_SERVICES
  ? localMembersFetcher
  : supaMembersFetcher

export const membersDashboardFetcher = process.env.USE_LOCAL_SERVICES
  ? localMembersDashboardFetcher
  : supaMembersDashboardFetcher

export const memberFetcher = process.env.USE_LOCAL_SERVICES
  ? localMemberFetcher
  : supaMemberFetcher

/*
 * Orders
 */
export const ordersDashboardFetcher = process.env.USE_LOCAL_SERVICES
  ? localOrdersDashboardFetcher
  : supaOrdersDashboardFetcher

export const ordersForMember = process.env.USE_LOCAL_SERVICES
  ? localOrdersForMember
  : supaOrdersForMember

export const orderFetcher = process.env.USE_LOCAL_SERVICES
  ? localOrderFetcher
  : supaOrderFetcher

export const ordersDataTableFetcher = process.env.USE_LOCAL_SERVICES
  ? localOrdersDataTableFetcher
  : supaOrdersDataTableFetcher

/*
 * WholesaleOrders
 */
export const wholesaleOrdersFetcher = process.env.USE_LOCAL_SERVICES
  ? localWholesaleOrdersFetcher
  : supaWholesaleOrdersFetcher

export const wholesaleOrderFetcher = process.env.USE_LOCAL_SERVICES
  ? localWholesaleOrderFetcher
  : supaWholesaleOrderFetcher

export const wholesaleOrdersDashboardFetcher = process.env.USE_LOCAL_SERVICES
  ? localWholesaleOrdersDashboardFetcher
  : supaWholesaleOrdersDashboardFetcher

export const wholesaleOrdersDataTableFetcher = process.env.USE_LOCAL_SERVICES
  ? localWholesaleOrdersDataTableFetcher
  : supaWholesaleOrdersDataTableFetcher

export const wholesaleOrderLineItemsFetcher = process.env.USE_LOCAL_SERVICES
  ? localWholesaleOrderLineItemsFetcher
  : supaWholesaleOrderLineItemsFetcher
