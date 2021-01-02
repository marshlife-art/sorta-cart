import { combineReducers } from 'redux'

import { Action } from './actions'

export interface AnnouncementService {
  open: boolean
}
export interface AnnouncementServiceProps {
  announcementService: AnnouncementService
}

const announcementService = (
  state: AnnouncementService = { open: false },
  action: Action
): AnnouncementService => {
  if (action.type === 'OPEN') {
    return {
      open: true
    }
  } else if (action.type === 'CLOSE') {
    return {
      open: false
    }
  }
  return state
}

export default combineReducers<AnnouncementServiceProps>({
  announcementService
})
