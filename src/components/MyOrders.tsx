import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'

import MaterialTable from 'material-table'

import { API_HOST } from '../constants'
import { RootState } from '../redux'
import { UserServiceProps } from '../redux/session/reducers'
import { Order } from '../types/Order'
import OrderDetailPanel from './OrderDetailPanel'

function MyOrders(props: UserServiceProps & RouteComponentProps) {
  const { userService } = props
  const [myorders, setMyOrders] = useState<Order[]>([])

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
          console.log('/myorders', response)
          setMyOrders(response.orders || [])
        })
        .catch((err) => console.warn('onoz /member/me caught err:', err))
  }, [userService])

  return (
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
      detailPanel={(order) => <OrderDetailPanel order={order} />}
      onRowClick={(event, rowData, togglePanel) => togglePanel && togglePanel()}
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
  )
}

const mapStateToProps = (states: RootState): UserServiceProps => {
  return {
    userService: states.session.userService
  }
}

export default connect(mapStateToProps)(withRouter(MyOrders))
