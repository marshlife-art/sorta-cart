import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import Badge from '@material-ui/core/Badge'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import TagFacesIcon from '@material-ui/icons/TagFaces'
import SearchIcon from '@material-ui/icons/Search'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'

import UserMenu from './UserMenu'
import { useCartItemCount } from '../services/useCartService'
import CartDrawer from './CartDrawer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      boxShadow: 'none'
    },
    toolbar: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary
    },
    menuButton: {
      marginLeft: theme.spacing(2)
    },
    title: {
      flexGrow: 1
      // display: 'none',
      // [theme.breakpoints.up('sm')]: {
      //   display: 'block'
      // }
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto'
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    inputRoot: {
      color: 'inherit'
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200
        }
      }
    }
  })
)

export default function NavBar(props: { children?: React.ReactNode }) {
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
    <AppBar position="static" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.title} variant="h6" noWrap>
          MARSH COOP
        </Typography>

        {props.children}

        {/* <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div> */}

        {itemCount > 0 && (
          <IconButton
            edge="end"
            className={classes.menuButton}
            color="inherit"
            aria-label="show cart"
            onClick={() => setCartDrawerOpen(prev => !prev)}
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
      </Toolbar>
      <UserMenu anchorEl={userMenuAnchorEl} setAnchorEl={setUserMenuAnchorEl} />
      <CartDrawer open={cartDrawerOpen} setOpen={setCartDrawerOpen} />
    </AppBar>
  )
}
