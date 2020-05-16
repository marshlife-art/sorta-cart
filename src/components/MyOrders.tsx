import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'

import MaterialTable from 'material-table'

import { API_HOST } from '../constants'
import { RootState } from '../redux'
import { UserServiceProps } from '../redux/session/reducers'
import { Order } from '../types/Order'
import OrderDetailPanel from './OrderDetailPanel'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `0 ${theme.spacing(2)}px`
  },
  storeCredit: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.text.primary
  }
}))

export async function fetchStoreCredit(
  token: string | null | undefined,
  setStoreCredit: React.Dispatch<React.SetStateAction<number>>
) {
  if (!token) {
    return
  }
  const store_credit = await fetch(`${API_HOST}/store_credit`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then((response: any) => response.json())
    .then((response) =>
      response && response.store_credit ? response.store_credit : 0
    )
    .catch((err: any) => 0)

  setStoreCredit(store_credit)
}

function MyOrders(props: UserServiceProps & RouteComponentProps) {
  const { userService } = props
  const classes = useStyles()
  const [myorders, setMyOrders] = useState<Order[]>([])
  const [storeCredit, setStoreCredit] = useState(0)
  const [refetchOrders, setRefetchOrders] = useState(0)

  const storeCreditAction = {
    icon: () =>
      storeCredit !== 0 ? (
        <div className={classes.storeCredit}>
          <div style={{ fontSize: '0.8em' }}>{`$${Math.abs(storeCredit).toFixed(
            2
          )}`}</div>
          <div style={{ fontSize: '0.6em' }}>store credit</div>
        </div>
      ) : (
        <></>
      ),
    isFreeAction: true,
    onClick: () => {},
    disabled: true
  }

  useEffect(() => {
    userService.user &&
      userService.user.token &&
      fetch(`${API_HOST}/myorders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userService.user.token}`
        }
      })
        .then((r) => r.json())
        .then((response) => {
          setMyOrders(response.orders || [])
        })
        .catch((err) => console.warn('onoz /member/me caught err:', err))
    userService.user &&
      userService.user.token &&
      fetchStoreCredit(userService.user.token, setStoreCredit)
  }, [userService, refetchOrders])

  return (
    <div className={`${classes.root} MyOrders`}>
      <MaterialTable
        columns={[
          {
            title: 'Created',
            field: 'createdAt',
            type: 'date'
          },
          {
            title: 'Status',
            field: 'status',
            type: 'string'
          },
          {
            title: 'Payment Status',
            field: 'payment_status',
            type: 'string'
          },
          {
            title: 'Shipment Status',
            field: 'shipment_status',
            type: 'string'
          },
          { title: 'Item Count', field: 'item_count', type: 'numeric' },
          {
            title: 'Total',
            field: 'total',
            type: 'currency'
          },
          { title: 'id', field: 'id', type: 'string', hidden: true }
        ]}
        data={myorders}
        title="My Orders"
        actions={[storeCreditAction]}
        detailPanel={(order) => (
          <OrderDetailPanel order={order} setRefetchOrders={setRefetchOrders} />
        )}
        onRowClick={(event, rowData, togglePanel) =>
          togglePanel && togglePanel()
        }
        options={{
          headerStyle: { position: 'sticky', top: 0 },
          filterCellStyle: { maxWidth: '132px' },
          maxBodyHeight: 'calc(100vh - 133px)',
          pageSize: 50,
          pageSizeOptions: [50, 100, 500],
          debounceInterval: 750,
          emptyRowsWhenPaging: false,
          search: false
        }}
      />
    </div>
  )
}

const mapStateToProps = (states: RootState): UserServiceProps => {
  return {
    userService: states.session.userService
  }
}

export default connect(mapStateToProps)(withRouter(MyOrders))
