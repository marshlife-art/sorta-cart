import React, { useState, useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { RootState } from '../redux'
import { UserService } from '../redux/session/reducers'
import { Order } from '../types/Order'
import OrderDetailPanel from './OrderDetailPanel'
import Login from './Login'
import { myOrder } from '../services/orderService'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `0 ${theme.spacing(2)}px`
  },
  error: {
    display: 'flex',
    width: '100%',
    minHeight: '66vh',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center'
  }
}))

export default function MyOrders() {
  const userService = useSelector<RootState, UserService>(
    (state) => state.session.userService
  )
  const match = useMatch('/order/:id')

  const classes = useStyles()
  const [order, setOrder] = useState<Order>()
  const [refetchOrders, setRefetchOrders] = useState(0)
  const [error, setError] = useState('')

  const orderId = match?.params?.id

  useEffect(() => {
    userService.user &&
      orderId &&
      userService.user &&
      myOrder(orderId, userService.user)
        .then((response) => {
          const { order, error } = response
          if (!error && order) {
            setOrder(order as Order)
          }
        })
        .catch((err) => setError('Order not found!'))
  }, [userService, orderId, refetchOrders])

  return (
    <Paper className={classes.root}>
      {!userService.isFetching &&
        !(userService.user && userService.user.id !== undefined) && (
          <Login
            showTitle
            onLoginFn={() => setRefetchOrders((prev) => prev + 1)}
          />
        )}
      {order && !error && (
        <OrderDetailPanel order={order} setRefetchOrders={setRefetchOrders} />
      )}
      {error && (
        <Box color="error.main" className={classes.error}>
          <Typography variant="h3" display="block" gutterBottom>
            {error}
          </Typography>
        </Box>
      )}
    </Paper>
  )
}
