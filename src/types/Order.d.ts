export type PaymentStatus =
  | 'balance_due'
  | 'credit_owed'
  | 'failed'
  | 'paid'
  | 'void'
export type ShipmentStatus =
  | 'backorder'
  | 'canceled'
  | 'partial'
  | 'pending'
  | 'ready'
  | 'shipped'
export type OrderStatus =
  | 'new'
  | 'pending'
  | 'needs_review'
  | 'void'
  | 'complete'
  | 'archived'
export type OLIStatus = 'backorder' | 'on_hand' | 'void'

export interface OrderRouterProps {
  id: string
}
