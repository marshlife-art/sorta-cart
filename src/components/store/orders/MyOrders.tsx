import React, { useEffect, useState } from 'react'
import { UserService, userService } from '../../../redux/session/reducers'
import { getStoreCreditForUser, myOrders } from '../../../services/orderService'

import MaterialTable from 'material-table'
import { Order } from '../../../types/Order'
import OrderDetailPanel from './OrderDetailPanel'
import { RootState } from '../../../redux'
import { formatDistance } from 'date-fns'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

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

async function fetchStoreCredit(
  setStoreCredit: React.Dispatch<React.SetStateAction<number>>,
  userService?: UserService
) {
  if (!userService?.user?.id) {
    return
  }
  const store_credit = await getStoreCreditForUser(userService.user.id)
  setStoreCredit(store_credit)
}

export default function MyOrders() {
  const userService = useSelector<RootState, UserService>(
    (state) => state.session.userService
  )

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
      myOrders(userService.user?.id)
        .then((response) => {
          const { orders, error } = response
          if (!error && orders) {
            setMyOrders((orders as Order[]) || [])
          }
        })
        .catch((err) => console.warn('onoz myOrders service caught err:', err))
    userService.user && fetchStoreCredit(setStoreCredit, userService)
  }, [userService, refetchOrders])

  return (
    <div className={`${classes.root} MyOrders`}>
      <MaterialTable
        columns={[
          {
            title: 'Created',
            field: 'createdAt',
            type: 'date',
            render: (row) =>
              row.createdAt &&
              formatDistance(new Date(row.createdAt), Date.now(), {
                addSuffix: true
              })
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
