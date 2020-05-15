import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { API_HOST } from '../constants'
import { RootState } from '../redux'
import { UserServiceProps } from '../redux/session/reducers'
import { Order } from '../types/Order'
import OrderDetailPanel from './OrderDetailPanel'
import Login from './Login'

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

function MyOrders(
  props: UserServiceProps & RouteComponentProps<{ id?: string }>
) {
  const { userService } = props
  const classes = useStyles()
  const [order, setOrder] = useState<Order>()
  const [refetchOrders, setRefetchOrders] = useState(0)
  const [error, setError] = useState('')

  const orderId = props.match && props.match.params && props.match.params.id

  useEffect(() => {
    userService.user &&
      userService.user.token &&
      orderId &&
      fetch(`${API_HOST}/getorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userService.user.token}`
        },
        body: JSON.stringify({ OrderId: orderId })
      })
        .then((r) => r.json())
        .then((response) => {
          if (response && response.order) {
            setOrder(response.order)
          } else {
            setError('Order not found!')
          }
        })
        .catch((err) => setError('Order not found!'))
  }, [userService, orderId, refetchOrders])

  // console.log('userService:', userService)
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

const mapStateToProps = (states: RootState): UserServiceProps => {
  return {
    userService: states.session.userService
  }
}

export default connect(mapStateToProps)(withRouter(MyOrders))
