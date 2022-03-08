import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import { preferencesService } from '../src/redux/preferences/reducers'
import { userService } from '../src/redux/session/reducers'
import { announcementService } from '../src/redux/announcement/reducers'

const preloadedState = {
  session: {
    userService: {
      isFetching: false,
      user: {
        id: 'story-user',
        name: 'story-user',
        email: 'story@use.r',
        phone: '666-666-6666',
        address: '666 Devel Dr.',
        token: 'story-user-token',
        role: 'admin'
      }
    }
  },
  preferences: {
    preferencesService: {
      isFetching: false,
      preferences: { dark_mode: 'true', last_seen_announcement: '0' }
    }
  },
  announcement: { announcementService: { open: false } }
}

const store = configureStore({
  reducer: {
    session: userService,
    preferences: preferencesService,
    announcement: announcementService
  },
  preloadedState
})

import Index from './index.mdx'

ReactDOM.render(
  <Provider store={store}>
    <MemoryRouter><Index /></MemoryRouter>
    
  </Provider>,
  document.getElementById('root')
)
