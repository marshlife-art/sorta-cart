import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import session, { UserServiceProps } from './session/reducers'
import preferences, { PreferencesServiceProps } from './preferences/reducers'
import announcement, {AnnouncementServiceProps} from './announcement/reducers'

export interface RootState {
  session: UserServiceProps
  preferences: PreferencesServiceProps
  announcement: AnnouncementServiceProps
}

export default createStore(
  combineReducers<RootState>({
    session,
    preferences,
    announcement
  }),
  applyMiddleware(thunk)
)
