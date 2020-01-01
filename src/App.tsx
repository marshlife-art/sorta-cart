import React from 'react'
import { connect } from 'react-redux'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'

import { darkTheme, lightTheme } from './theme'
import { RootState } from './redux'
import { PreferencesServiceProps } from './redux/preferences/reducers'

import DataTable from './components/DataTable'

export function App(props: PreferencesServiceProps) {
  const { preferencesService } = props
  const theme =
    preferencesService &&
    preferencesService.preferences &&
    preferencesService.preferences.dark_mode === 'true'
      ? darkTheme
      : lightTheme
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {/* #TODO: add router */}
      <DataTable />
    </ThemeProvider>
  )
}

// export default App

const mapStateToProps = (states: RootState): PreferencesServiceProps => {
  return {
    preferencesService: states.preferences.preferencesService
  }
}

export default connect(mapStateToProps, {})(App)
