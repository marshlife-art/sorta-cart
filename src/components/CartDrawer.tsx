import React from 'react'
import { connect } from 'react-redux'
import Drawer from '@material-ui/core/Drawer'

import { RootState } from '../redux'
import { UserServiceProps } from '../redux/session/reducers'
import { useCartService, emptyCart } from '../services/useCartService'
import CartTable from './CartTable'
import UserLoginPrompt from './UserLoginPrompt'

interface CartDrawerProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function CartDrawer(props: CartDrawerProps & UserServiceProps) {
  const { open, setOpen, userService } = props
  const cartResult = useCartService()

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

const mapStateToProps = (states: RootState): UserServiceProps => {
  return {
    userService: states.session.userService
  }
}
export default connect(mapStateToProps, {})(CartDrawer)
