import React from 'react'
import Drawer from '@material-ui/core/Drawer'

interface CartDrawerProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function CartDrawer(props: CartDrawerProps) {
  const { open, setOpen } = props
  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(!open)}>
      imma drawer!
    </Drawer>
  )
}

export default CartDrawer
