import {
  updateNoBackorder as supaUpdateNoBackorder,
  upsertProducts as supaUpsertProducts,
  deleteProducts as supaDeleteProducts,
  updateProducts as supaUpdateProducts
} from './supabase/products'
import {
  deleteMember as supaDeleteMember,
  upsertMember as supaUpsertMember
} from './supabase/members'
import {
  deleteCatmap as supaDeleteCatmap,
  upsertCatmap as supaUpsertCatmap
} from './supabase/catmap'
import {
  updateOrderStatus as supaUpdateOrderStatus,
  updateOrderShipmentStatus as supaUpdateOrderShipmentStatus,
  deleteOrders as supaDeleteOrders
} from './supabase/orders'
import {
  insertWholesaleOrder as supaInsertWholesaleOrder,
  deleteWholesaleOrder as supaDeleteWholesaleOrder,
  upsertWholesaleOrder as supaUpsertWholesaleOrder
} from './supabase/wholesaleorders'
import {
  updateOrderLineItems as supaUpdateOrderLineItems,
  insertOrderLineItem as supaInsertOrderLineItem
} from './supabase/orderlineitems'

import {
  updateNoBackorder as localUpdateNoBackorder,
  upsertProducts as localUpsertProducts,
  deleteProducts as localDeleteProducts,
  updateProducts as localUpdateProducts
} from './local/products'
import {
  deleteMember as localDeleteMember,
  upsertMember as localUpsertMember
} from './local/members'
import {
  deleteCatmap as localDeleteCatmap,
  upsertCatmap as localUpsertCatmap
} from './local/catmap'
import {
  updateOrderStatus as localUpdateOrderStatus,
  updateOrderShipmentStatus as localUpdateOrderShipmentStatus,
  deleteOrders as localDeleteOrders
} from './local/orders'
import {
  insertWholesaleOrder as localInsertWholesaleOrder,
  deleteWholesaleOrder as localDeleteWholesaleOrder,
  upsertWholesaleOrder as localUpsertWholesaleOrder
} from './local/wholesaleorders'
import {
  updateOrderLineItems as localUpdateOrderLineItems,
  insertOrderLineItem as localInsertOrderLineItem
} from './local/orderlineitems'

/*
 * Products
 */
export const updateNoBackorder = process.env.USE_LOCAL_SERVICES
  ? localUpdateNoBackorder
  : supaUpdateNoBackorder

export const upsertProducts = process.env.USE_LOCAL_SERVICES
  ? localUpsertProducts
  : supaUpsertProducts
export const deleteProducts = process.env.USE_LOCAL_SERVICES
  ? localDeleteProducts
  : supaDeleteProducts
export const updateProducts = process.env.USE_LOCAL_SERVICES
  ? localUpdateProducts
  : supaUpdateProducts

/*
 * Members
 */
export const deleteMember = process.env.USE_LOCAL_SERVICES
  ? localDeleteMember
  : supaDeleteMember

export const upsertMember = process.env.USE_LOCAL_SERVICES
  ? localUpsertMember
  : supaUpsertMember
/*
 * Catmap
 */
export const upsertCatmap = process.env.USE_LOCAL_SERVICES
  ? localUpsertCatmap
  : supaUpsertCatmap

export const deleteCatmap = process.env.USE_LOCAL_SERVICES
  ? localDeleteCatmap
  : supaDeleteCatmap

/*
 * Orders
 */

export const updateOrderStatus = process.env.USE_LOCAL_SERVICES
  ? localUpdateOrderStatus
  : supaUpdateOrderStatus

export const updateOrderShipmentStatus = process.env.USE_LOCAL_SERVICES
  ? localUpdateOrderShipmentStatus
  : supaUpdateOrderShipmentStatus

export const deleteOrders = process.env.USE_LOCAL_SERVICES
  ? localDeleteOrders
  : supaDeleteOrders

/*
 * WholesaleOrders
 */

export const insertWholesaleOrder = process.env.USE_LOCAL_SERVICES
  ? localInsertWholesaleOrder
  : supaInsertWholesaleOrder

export const deleteWholesaleOrder = process.env.USE_LOCAL_SERVICES
  ? localDeleteWholesaleOrder
  : supaDeleteWholesaleOrder

export const upsertWholesaleOrder = process.env.USE_LOCAL_SERVICES
  ? localUpsertWholesaleOrder
  : supaUpsertWholesaleOrder

/*
 * OrderLineItems
 */

export const updateOrderLineItems = process.env.USE_LOCAL_SERVICES
  ? localUpdateOrderLineItems
  : supaUpdateOrderLineItems

export const insertOrderLineItem = process.env.USE_LOCAL_SERVICES
  ? localInsertOrderLineItem
  : supaInsertOrderLineItem
