import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import { useCartService } from '../services/useCartService'
import { LineItem } from '../types/Product'

interface CartDrawerProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function LineItemRow(line_item: LineItem) {
  return (
    <div>
      <div>
        <span>{line_item.name}</span>
        <span>{line_item.description}</span>
      </div>
      <div>
        <span>{line_item.category}</span>
        <span>{line_item.sub_category}</span>
      </div>
      <div>
        <span>{line_item.quantity}</span>
        <span>{line_item.selected_unit}</span>
        <span>${line_item.total.toFixed(2)}</span>
      </div>
    </div>
  )
}

function CartDrawer(props: CartDrawerProps) {
  const { open, setOpen } = props

  const cartResult = useCartService()

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(!open)}>
      {cartResult.status !== 'loaded' && 'Loading...'}
      {cartResult.status === 'loaded' && (
        <div>
          {cartResult.payload.line_items.map((line_item, idx) => (
            <LineItemRow key={`li${idx}`} {...line_item} />
          ))}
        </div>
      )}
    </Drawer>
  )
}

export default CartDrawer
