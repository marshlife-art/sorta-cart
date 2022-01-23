import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Drawer from '@material-ui/core/Drawer'

import { RootState } from '../redux'
import { UserService } from '../redux/session/reducers'
import {
  useCartService,
  emptyCart,
  validateLineItems
} from '../services/useCartService'
import CartTable from './CartTable'
import UserLoginPrompt from './UserLoginPrompt'

interface CartDrawerProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CartDrawer(props: CartDrawerProps) {
  const { open, setOpen } = props
  const userService = useSelector<RootState, UserService>(
    (state) => state.session.userService
  )
  const cartResult = useCartService()

  useEffect(() => {
    open && validateLineItems({ removeInvalidLineItems: false })
  }, [open])

  const emptyCartAndCloseDrawer = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (window.confirm('Are you sure?')) {
      emptyCart()
      setOpen(false)
    }
  }

  const hasUser = !!(userService && userService.user && userService.user.id)

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(!open)}>
      {cartResult.status !== 'loaded' && 'Loading...'}
      {hasUser ? (
        cartResult.status === 'loaded' &&
        cartResult.payload.line_items.length > 0 && (
          <CartTable
            line_items={cartResult.payload.line_items}
            emptyCartAndCloseDrawer={emptyCartAndCloseDrawer}
            closeDrawer={() => setOpen(false)}
          />
        )
      ) : (
        <UserLoginPrompt />
      )}
    </Drawer>
  )
}
