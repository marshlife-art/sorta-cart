export interface OpenAction {
  type: 'OPEN'
  open: boolean
}
export interface CloseAction {
  type: 'CLOSE'
  open: boolean
}

export type Action = OpenAction | CloseAction

export const openAnnouncement = (): OpenAction => {
  return { type: 'OPEN', open: true }
}

export const closeAnnouncement = (): CloseAction => {
  return { type: 'CLOSE', open: false }
}
