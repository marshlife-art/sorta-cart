import React from 'react'
import Drawer from '@material-ui/core/Drawer'

import { useCartService, emptyCart } from '../services/useCartService'
import CartTable from './CartTable'

interface CartDrawerProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function CartDrawer(props: CartDrawerProps) {
  const { open, setOpen } = props
  const cartResult = useCartService()

  const emptyCartAndCloseDrawer = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (window.confirm('Are you sure?')) {
      emptyCart()
      setOpen(false)
    }
  }

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(!open)}>
      {cartResult.status !== 'loaded' && 'Loading...'}
      {cartResult.status === 'loaded' &&
        cartResult.payload.line_items.length > 0 && (
          <CartTable
            line_items={cartResult.payload.line_items}
            emptyCartAndCloseDrawer={emptyCartAndCloseDrawer}
          />
        )}
    </Drawer>
  )
}

export default CartDrawer
