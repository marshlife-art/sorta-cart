import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
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
import ProductsGrid from './components/ProductsGrid'
import Checkout from './components/Checkout'
import Login from './components/Login'
import Register from './components/Register'
import NavBar from './components/NavBar'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import MyOrders from './components/MyOrders'
import Order from './components/Order'
import Announcements from './components/Announcements'

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
      {preferencesService.preferences && (
        <Announcements preferences={preferencesService.preferences} />
      )}
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/products" element={<DataTable />} />
          <Route path="/products/onhand/:onhand" element={<DataTable />} />
          <Route path="/products/:cat/" element={<DataTable />} />
          <Route path="/products/:cat/:subcat" element={<DataTable />} />
          <Route
            path="/orders"
            element={
              <>
                <NavBar />
                <MyOrders />
              </>
            }
          />
          <Route
            path="/order/:id"
            element={
              <>
                <NavBar />
                <Order />
              </>
            }
          />
          <Route
            path="/forgotpassword"
            element={
              <>
                <NavBar />
                <ForgotPassword />
              </>
            }
          />

          <Route
            path="/resetpassword"
            element={
              <>
                <NavBar />
                <ResetPassword />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <NavBar />
                <Login showTitle />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <NavBar />
                <Register />
              </>
            }
          />
          <Route path="/" element={<ProductsGrid />} />
        </Routes>
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
