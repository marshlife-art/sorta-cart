import React, { useEffect, useState } from 'react'
import { Button, Divider, Menu, MenuItem } from '@material-ui/core'

import { OrderStatus } from '../../../types/Order'
import { useAllWholesaleOrdersService } from '../wholesaleorders/useWholesaleOrderService'
import { wholesaleOrderFetcher } from '../../../services/fetchers'
import { calcLineItemAdjustments } from '../wholesaleorders/calc-line-item-adjustments'
import { SquareImportItem } from './SquareImport'
import { SupaProduct } from '../../../types/SupaTypes'

interface WholesaleOrdersSelectProps {
  onAddWholesaleOrderItems(items: SquareImportItem[]): void
}
export default function WholesaleOrdersSelect(
  props: WholesaleOrdersSelectProps
) {
  const { onAddWholesaleOrderItems } = props
  const [wholesaleorderLookup, setWholesaleOrderLookup] =
    useState<Array<{ id: string; name: string }>>()
  const [reloadOrders, setReloadOrders] = useState(true)
  const [wholesaleorderMenuAnchorEl, setWholesaleOrderMenuAnchorEl] =
    useState<null | HTMLElement>(null)

  const allWholesaleOrders = useAllWholesaleOrdersService(
    null as unknown as OrderStatus,
    () => {},
    reloadOrders,
    setReloadOrders
  )
  const handleWholesaleOrderSelect = async (id: string) => {
    if (allWholesaleOrders.status === 'loaded') {
      const wholesaleOrder = allWholesaleOrders.payload.find(
        (o) => o.id === Number(id)
      )

      const { data, error } = await wholesaleOrderFetcher(Number(id))

      if (error || !data) {
        console.warn('useWholesaleOrderService got error:', error)
        // #TODO: handle errorz
        console.warn('caught error or no data:', error)
      } else {
        console.log('wholesale order data:', data.OrderLineItems.length)
        const adjustments = calcLineItemAdjustments({
          lineItems: data.OrderLineItems
        })

        const hasQtyAdjustment: SquareImportItem[] = Object.values(
          adjustments.groupedLineItems
        )
          .filter((item) => item.qtyAdjustments > 0)
          .map((item, idx) => ({
            id: idx,
            name: `{${item.product?.description} ${item.product?.name}}`,
            product: item.product as SupaProduct, // #TODO: ugh tsc :/
            qty: item.qtyAdjustments
          }))
        console.log('wholesale order adjustments:', hasQtyAdjustment)

        onAddWholesaleOrderItems(hasQtyAdjustment)
        setWholesaleOrderMenuAnchorEl(null)
      }
    }
  }
  const handleWholesaleOrderMenuClose = () => {
    setWholesaleOrderMenuAnchorEl(null)
  }
  const handleWholesaleOrderMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setWholesaleOrderMenuAnchorEl(event.currentTarget)
  }

  useEffect(() => {
    if (allWholesaleOrders.status === 'loaded') {
      setWholesaleOrderLookup(
        allWholesaleOrders.payload
          .filter(
            (wo) => wo.status && ['new', 'needs_review'].includes(wo.status)
          )
          .map((order) => ({
            id: `${order.id}`,
            name: `${order.vendor} ${new Date(
              order.createdAt || ''
            ).toLocaleDateString()}`
          }))
      )
    }
  }, [allWholesaleOrders])

  return (
    <>
      <Button onClick={handleWholesaleOrderMenuOpen} variant="contained">
        Add Wholesale Order Adjustments
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={wholesaleorderMenuAnchorEl}
        keepMounted
        open={Boolean(wholesaleorderMenuAnchorEl)}
        onClose={handleWholesaleOrderMenuClose}
      >
        <Divider />
        {wholesaleorderLookup &&
          wholesaleorderLookup.map(
            (wholesaleorder: { id: string; name: string }) => (
              <MenuItem
                key={`wholesaleorder-sel-${wholesaleorder.id}`}
                onClick={() => handleWholesaleOrderSelect(wholesaleorder.id)}
              >
                {wholesaleorder.name}
              </MenuItem>
            )
          )}
      </Menu>
    </>
  )
}
