import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Menu, { MenuProps } from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
// import AnnouncementIcon from '@material-ui/icons/Notifications'

import { RootState } from '../redux'
import { setPreferences } from '../redux/preferences/actions'
import { logout } from '../redux/session/actions'
// import { openAnnouncement } from '../redux/announcement/actions'

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5'
  }
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
    {...props}
  />
))

const StyledMenuItem = withStyles((theme) => ({
  root: {
    // '&:focus': {
    //   backgroundColor: theme.palette.primary.main,
    //   '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
    //     color: theme.palette.common.white
    //   }
    // }
  }
}))(MenuItem)

interface UserMenuProps {
  anchorEl: HTMLElement | null
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>
}

export default function UserMenu(props: UserMenuProps) {
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { anchorEl, setAnchorEl } = props

  const navigate = useNavigate()

  const preferencesService = useSelector(
    (state: RootState) => state.preferences.preferencesService
  )
  const userService = useSelector(
    (state: RootState) => state.session.userService
  )

  const dispatch = useDispatch()

  const [useDarkTheme, setUseDarkTheme] = useState<null | boolean>(null)

  useEffect(() => {
    if (!preferencesService.isFetching && preferencesService.preferences) {
      if (useDarkTheme === null) {
        setUseDarkTheme(
          preferencesService.preferences.dark_mode === 'true' ? true : false
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferencesService])

  useEffect(() => {
    if (
      preferencesService &&
      preferencesService.preferences &&
      useDarkTheme !== null &&
      (preferencesService.preferences.dark_mode === 'true' ? true : false) !==
        useDarkTheme
    ) {
      dispatch(
        setPreferences({
          ...preferencesService.preferences,
          dark_mode: useDarkTheme ? 'true' : 'false'
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useDarkTheme])

  const handleClose = () => {
    setAnchorEl(null)
  }

  const hasUser = !!(userService && userService.user && userService.user.id)
  const isAdmin = !!(
    userService &&
    userService.user &&
    userService.user.role === 'admin'
  )
  return (
    <>
      <StyledMenu
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {hasUser && (
          <ListItemText
            primary={userService.user && userService.user.email}
            secondary={userService.user && userService.user.role}
            style={{ padding: '0 16px 6px', borderBottom: 'thin solid #f60' }}
          />
        )}
        {isAdmin && (
          <StyledMenuItem
            onClick={() => {
              navigate('/admin')
              handleClose()
            }}
          >
            <ListItemText primary="ADMIN" />
          </StyledMenuItem>
        )}

        {hasUser && (
          <StyledMenuItem
            onClick={() => {
              navigate('/orders')
              handleClose()
            }}
          >
            <ListItemText primary="My Orders" />
          </StyledMenuItem>
        )}

        {hasUser && (
          <StyledMenuItem
            onClick={() => {
              dispatch(logout())
              handleClose()
            }}
          >
            <ListItemText primary="Log out" />
          </StyledMenuItem>
        )}

        {!hasUser && (
          <StyledMenuItem
            onClick={() => {
              navigate('/login')
              handleClose()
            }}
          >
            <ListItemText primary="Sign in" />
          </StyledMenuItem>
        )}

        {!hasUser && (
          <StyledMenuItem
            onClick={() => {
              navigate('/register')
              handleClose()
            }}
          >
            <ListItemText primary="Join the Co-op" />
          </StyledMenuItem>
        )}

        <StyledMenuItem onClick={() => setUseDarkTheme((prev) => !prev)}>
          <ListItemText>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Dark Theme</span>
              <Switch
                checked={
                  useDarkTheme === null || useDarkTheme === undefined
                    ? false
                    : useDarkTheme
                }
                value="useDarkTheme"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </div>
          </ListItemText>
        </StyledMenuItem>

        {/* <StyledMenuItem
          onClick={() => {
            dispatch(openAnnouncement())
            handleClose()
          }}
        >
          <ListItemText>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>Show Announcements</span>
              <AnnouncementIcon />
            </div>
          </ListItemText>
        </StyledMenuItem> */}

        <StyledMenuItem
          onClick={() => {
            handleClose()
            window.location.href = 'https://marshlife-art.org'
          }}
        >
          <ListItemText primary="marshlife-art.org" />
        </StyledMenuItem>
      </StyledMenu>
    </>
  )
}
