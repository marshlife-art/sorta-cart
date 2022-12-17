import { LoginError, LoginMessage, User } from '../../types/User'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'

import { AnyAction } from 'redux'
import { Member } from '../../types/Member'
import { auth } from '../../services/auth'
import { registerMember } from '../../services/memberService'

export interface SetAction {
  type: 'SET'
  user: User
}
export interface SetFetcing {
  type: 'SET_FETCHING'
  isFetching: boolean
}
export interface SetError {
  type: 'SET_ERROR'
  error: LoginError
}
export interface SetMagic {
  type: 'SET_MAGIC'
  message: LoginMessage
}

export type Action = SetAction | SetFetcing | SetError | SetMagic

export const set = (user: User): SetAction => {
  return { type: 'SET', user }
}
export const setError = (error: LoginError): SetError => {
  return { type: 'SET_ERROR', error }
}
export const isFetching = (isFetching: boolean): SetFetcing => {
  return { type: 'SET_FETCHING', isFetching }
}
export const setMagic = (message: LoginMessage): SetMagic => {
  return { type: 'SET_MAGIC', message }
}

const NULL_USER: User = {
  id: undefined,
  email: undefined,
  token: undefined
}

export const checkSession = (): ThunkAction<
  Promise<void>,
  {},
  {},
  AnyAction
> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>((resolve) => {
      dispatch(isFetching(true))

      const session = auth.getSession()
      // console.log('zomg session:', session)
      if (session?.user) {
        dispatch(set({ ...session.user, role: 'admin' })) // #TODO: don't hard-code admin role :/
      } else {
        dispatch(set(NULL_USER))
      }

      dispatch(isFetching(false))
      resolve()
    })
  }
}

export const login = (
  email: string,
  password?: string
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>((resolve) => {
      dispatch(isFetching(true))

      auth
        .signIn(email, password)
        .then((response) => {
          if (response.user && response.user.id) {
            dispatch(set({ ...response.user, role: 'admin' })) // #TODO: don't hard-code admin role :/
          } else {
            if (!password && !response.error) {
              dispatch(
                setMagic({
                  message: 'Check your email for a magic login link.'
                })
              )
            } else {
              dispatch(
                setError({
                  error: 'error',
                  reason: response.error?.message || 'unknown error'
                })
              )
            }
          }
        })
        .catch((err) => {
          console.warn('[login] caught error:', err.response.text)
        })
        .finally(() => resolve())
    })
  }
}

export const logout = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>((resolve) => {
      dispatch(isFetching(true))

      auth
        .signOut()
        .catch(console.warn)
        .finally(() => {
          dispatch(set(NULL_USER))
          dispatch(isFetching(false))
          resolve()
        })
    })
  }
}

export const register = (
  user: Partial<User>,
  member: Partial<Member>,
  sourceId: string
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>((resolve) => {
      dispatch(isFetching(true))

      registerMember({ user, member, sourceId })
        .then((response) => {
          // console.log('zomg registerMember response:', response)
          if (response.msg === 'ok' && response.user && response.user.email) {
            auth.signIn(response.user.email)
            dispatch(set(response.user))
          } else {
            dispatch(setError({ error: 'error', reason: response.msg }))
          }
        })
        .catch((e) => {
          console.warn('register error:', e)
          dispatch(
            setError({
              error: 'error',
              reason: 'unable to register right now :('
            })
          )
        })
        .finally(() => {
          dispatch(isFetching(false))
          resolve()
        })

      // #TODO: FIX THIS (should never happen!?)
      dispatch(
        setError({
          error: 'error',
          reason: 'unable to register right now :('
        })
      )
      dispatch(isFetching(false))
      resolve()
    })
  }
}
