import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'

import { darkTheme, lightTheme } from './theme'
import { RootState } from './redux'

import { UserServiceProps } from './redux/session/reducers'
import { checkSession } from './redux/session/actions'

import { PreferencesServiceProps } from './redux/preferences/reducers'
import { getPreferences } from './redux/preferences/actions'

import DataTable from './components/DataTable'
import Landing from './components/Landing'
import Checkout from './components/Checkout'
import Login from './components/Login'
import Register from './components/Register'
import NavBar from './components/NavBar'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import MyOrders from './components/MyOrders'
import Order from './components/Order'

interface DispatchProps {
  checkSession: () => void
  getPreferences: () => void
}

export function App(
  props: PreferencesServiceProps & UserServiceProps & DispatchProps
) {
  const { preferencesService, checkSession, getPreferences } = props

  useEffect(() => {
    getPreferences && getPreferences()
  }, [getPreferences])

  useEffect(() => {
    checkSession && checkSession()
  }, [checkSession])

  const theme =
    preferencesService &&
    preferencesService.preferences &&
    preferencesService.preferences.dark_mode === 'true'
      ? darkTheme
      : lightTheme
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/checkout" exact component={Checkout} />
          <Route path="/products" exact component={DataTable} />
          <Route path="/products/:cat/" exact component={DataTable} />
          <Route path="/products/:cat/:subcat" component={DataTable} />
          <Route path="/orders" exact>
            <>
              <NavBar />
              <MyOrders />
            </>
          </Route>
          <Route path="/order/:id" exact>
            <>
              <NavBar />
              <Order />
            </>
          </Route>
          <Route path="/forgotpassword" exact>
            <>
              <NavBar />
              <ForgotPassword />
            </>
          </Route>
          <Route path="/resetpassword" exact>
            <>
              <NavBar />
              <ResetPassword />
            </>
          </Route>
          <Route path="/login" exact>
            <>
              <NavBar />
              <Login showTitle />
            </>
          </Route>
          <Route path="/register" exact>
            <>
              <NavBar />
              <Register />
            </>
          </Route>
          <Route path="/" component={Landing} />
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

const mapStateToProps = (
  states: RootState
): UserServiceProps & PreferencesServiceProps => {
  return {
    userService: states.session.userService,
    preferencesService: states.preferences.preferencesService
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>
): DispatchProps => {
  return {
    checkSession: () => dispatch(checkSession()),
    getPreferences: () => dispatch(getPreferences())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
