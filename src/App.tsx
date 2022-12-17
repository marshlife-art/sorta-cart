import React, { useEffect } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { darkTheme, lightTheme } from './theme'

import Announcements from './components/store/announcements/Announcements'
import Checkout from './components/store/checkout/Checkout'
import CssBaseline from '@material-ui/core/CssBaseline'
import DataTable from './components/store/products/DataTable'
import Login from './components/Login'
import MyOrders from './components/store/orders/MyOrders'
import NavBar from './components/store/NavBar'
import Order from './components/store/orders/Order'
import { PreferencesServiceProps } from './redux/preferences/reducers'
import ProductsGrid from './components/store/products/ProductsGrid'
import Register from './components/Register'
import { RootState } from './redux'
import { ThemeProvider } from '@material-ui/core/styles'
import { ThunkDispatch } from 'redux-thunk'
import { UserServiceProps } from './redux/session/reducers'
import { checkSession } from './redux/session/actions'
import { connect } from 'react-redux'
import { getPreferences } from './redux/preferences/actions'
import { supabase } from './lib/supabaseClient'
import Admin from './components/admin/Index'

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
    checkSession()

    const sub = supabase.auth.onAuthStateChange((event, session) => {
      checkSession()
    })
    return () => sub?.data?.unsubscribe()
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
          <Route path="/admin/*" element={<Admin />} />

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
