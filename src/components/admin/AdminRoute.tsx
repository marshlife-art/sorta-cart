import React from 'react'
import { Navigate } from 'react-router-dom'
import { RootState } from '../../redux'
import { UserService } from '../../redux/session/reducers'
import { useSelector } from 'react-redux'
import { auth } from '../../services/auth'

export default function AdminRoute(props: {
  path: string
  element?: JSX.Element
}) {
  const userService = useSelector<RootState, UserService>(
    (state) => state.session.userService
  )

  return auth.isAdmin(userService?.user) ? (
    props.element || <></>
  ) : (
    <Navigate
      to={{
        pathname: '/login'
      }}
    />
  )
}
