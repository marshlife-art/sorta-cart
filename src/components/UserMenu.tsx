import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { withStyles } from '@material-ui/core/styles'
import Menu, { MenuProps } from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'

import { RootState } from '../redux'
import { PreferencesServiceProps } from '../redux/preferences/reducers'
import { getPreferences, setPreferences } from '../redux/preferences/actions'
import { Preferences } from '../types/Preferences'

interface DispatchProps {
  getPreferences: () => void
  setPreferences: (preferences: Preferences) => void
}

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

const StyledMenuItem = withStyles(theme => ({
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
type Props = PreferencesServiceProps &
  DispatchProps &
  RouteComponentProps &
  UserMenuProps

function UserMenu(props: Props) {
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const {
    anchorEl,
    setAnchorEl,
    preferencesService,
    getPreferences,
    setPreferences,
    history
  } = props

  const [useDarkTheme, setUseDarkTheme] = useState<null | boolean>(null)

  useEffect(() => {
    getPreferences()
  }, [getPreferences])

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
      setPreferences({ dark_mode: useDarkTheme ? 'true' : 'false' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useDarkTheme])

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <StyledMenu
        id="user--menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem>
          <ListItemText
            primary="Sign in"
            onClick={() => history.push('/login')}
          />
        </StyledMenuItem>

        <StyledMenuItem>
          <ListItemText
            primary="Register"
            onClick={() => history.push('/register')}
          />
        </StyledMenuItem>

        <StyledMenuItem>
          <ListItemText onClick={() => setUseDarkTheme(prev => !prev)}>
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
      </StyledMenu>
    </>
  )
}

const mapStateToProps = (states: RootState): PreferencesServiceProps => {
  return {
    preferencesService: states.preferences.preferencesService
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>
): DispatchProps => {
  return {
    getPreferences: () => dispatch(getPreferences()),
    setPreferences: (preferences: Preferences) =>
      dispatch(setPreferences(preferences))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserMenu))
