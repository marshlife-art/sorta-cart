import React from 'react'
import { Navigate } from 'react-router-dom'
import { RootState } from '../../redux'
import { UserService } from '../../redux/session/reducers'
import { useSelector } from 'react-redux'

// #TODO: FIX THIS! :(((
const isAdmin = (userService: UserService): boolean => true
// userService.user && userService.user.role && userService.user.role === 'admin'
//   ? true
//   : false

export default function AdminRoute(props: {
  path: string
  element?: JSX.Element
}) {
  const userService = useSelector<RootState, UserService>(
    (state) => state.session.userService
  )

  console.log(
    'fuck isAdmin(userService):',
    isAdmin(userService),
    userService?.user?.role
  )
  return isAdmin(userService) ? (
    props.element || <></>
  ) : (
    <Navigate
      to={{
        pathname: '/login'
      }}
    />
  )
}
