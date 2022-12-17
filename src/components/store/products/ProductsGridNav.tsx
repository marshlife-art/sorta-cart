import React, { useState } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import Badge from '@material-ui/core/Badge'
import CartDrawer from '../cart/CartDrawer'
import IconButton from '@material-ui/core/IconButton'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import TagFacesIcon from '@material-ui/icons/TagFaces'
import UserMenu from '../../UserMenu'
import { useCartItemCount } from '../../../services/useCartService'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: 2,
      position: 'fixed',
      top: 5,
      right: 25,
      height: 50,
      width: 100,
      display: 'flex'
    },

    menuButton: {
      marginLeft: theme.spacing(2)
    }
  })
)

function ProductsGridNav() {
  const classes = useStyles()
  const itemCount = useCartItemCount()

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null
  )

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  return (
    <div className={classes.root}>
      {itemCount > 0 && (
        <IconButton
          edge="end"
          className={classes.menuButton}
          color="inherit"
          aria-label="show cart"
          onClick={() => setCartDrawerOpen((prev) => !prev)}
        >
          <Badge badgeContent={itemCount} max={99} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      )}

      <IconButton
        edge="end"
        className={classes.menuButton}
        color="inherit"
        aria-label="user menu"
        onClick={handleUserMenuClick}
      >
        <TagFacesIcon />
      </IconButton>

      <UserMenu anchorEl={userMenuAnchorEl} setAnchorEl={setUserMenuAnchorEl} />
      <CartDrawer open={cartDrawerOpen} setOpen={setCartDrawerOpen} />
    </div>
  )
}

export default ProductsGridNav
