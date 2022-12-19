import React, { useState, useEffect } from 'react'
import { useNavigate, useMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Icon } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Box from '@material-ui/core/Box'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { RootState } from '../../../redux'
import { UserService } from '../../../redux/session/reducers'
import Loading from '../../Loading'
import { useOrderService } from './useOrderService'
import {
  OrderStatus,
  ShipmentStatus,
  PaymentStatus
} from '../../../types/Order'
import OrderLineItems from './OrderLineItems'
import LineItemAutocomplete from './LineItemAutocomplete'
import MemberAutocomplete from './MemberAutocomplete'
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  SHIPMENT_STATUSES,
  TAX_RATE_STRING,
  TAX_RATE
} from '../../../constants'
import { getMemberCreditsAdjustmentsSums } from '../../../lib/storeCredit'
import { createOrder, updateOrder } from '../../../lib/orderService'
import {
  SuperOrderAndAssoc,
  SupaOrderLineItem,
  SupaProduct as Product
} from '../../../types/SupaTypes'
import { MemberOption } from '../../../services/fetchers/types'

type Order = Omit<SuperOrderAndAssoc, 'id'> & {
  id?: number
}
// type PartialOrder = Partial<Order>
type LineItem = SupaOrderLineItem
type PartialLineItem = Partial<SupaOrderLineItem>

const blankOrder: Order = {
  id: undefined,
  status: 'new',
  payment_status: 'balance_due',
  shipment_status: 'backorder',
  total: 0.0,
  item_count: 0,
  subtotal: 0,
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
  createdAt: '',
  updatedAt: '',
  OrderLineItems: []
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      maxWidth: '100vw',
      minHeight: '100vh'
    },
    form: {
      marginBottom: theme.spacing(4)
    },
    formInput: {
      display: 'block',
      marginBottom: theme.spacing(2)
    },
    status: {
      marginBottom: theme.spacing(2)
    },
    liHeader: {
      display: 'inline-block',
      marginRight: theme.spacing(2)
    },
    sticky: {
      [theme.breakpoints.up('md')]: {
        position: 'sticky',
        top: '0px'
      },
      zIndex: 1,
      backgroundColor: theme.palette.background.paper
    },
    saveBtn: {
      flexGrow: 1,
      marginLeft: theme.spacing(2)
    },
    orderSideHeading: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '54px',
      marginBottom: theme.spacing(2)
    },
    emailIcon: {
      marginRight: '5px'
    }
  })
)

export async function fetchStoreCredit(
  MemberId: string | number,
  setStoreCredit: React.Dispatch<React.SetStateAction<number>>
) {
  const { store_credit } = await getMemberCreditsAdjustmentsSums(MemberId)
  setStoreCredit(store_credit)
}

function tryNumber(input?: string | number): number {
  if (input === undefined) {
    return 0.0
  }
  const str = `${input}`
  if (isNaN(parseFloat(str))) {
    return 0.0
  }
  return +parseFloat(str).toFixed(2)
}

export default function EditOrder() {
  const navigate = useNavigate()
  const match = useMatch('/admin/orders/edit/:id')
  const userService = useSelector<RootState, UserService>(
    (state) => state.session.userService
  )

  const classes = useStyles()

  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order>(blankOrder)
  const [saving, setSaving] = useState(false)
  const [showLiAutocomplete, setShowLiAutocomplete] = useState(false)
  const [showMemberAutocomplete, setShowMemberAutocomplete] = useState(false)
  const [snackOpen, setSnackOpen] = React.useState(false)
  const [snackMsg, setSnackMsg] = React.useState('')
  const [needToCheckForDiscounts, setNeedToCheckForDiscounts] = useState(true)
  const [canApplyMemberDiscount, setCanApplyMemberDiscount] = useState(false)
  const orderService = useOrderService(orderId, setLoading)

  const [storeCredit, setStoreCredit] = useState<number>(0)

  useEffect(() => {
    if (orderService.status === 'loaded') {
      if (orderService.payload) {
        const _order = orderService.payload
        if (
          _order.Members &&
          _order.Members.discount &&
          _order.Members.discount > 0
        ) {
          setCanApplyMemberDiscount(true)
        }
        if (_order.Members && _order.Members.id) {
          fetchStoreCredit(_order.Members.id, setStoreCredit)
        }
        setOrder(_order)
      }
    }
  }, [orderService])

  const pOrderId = match?.params?.id

  useEffect(() => {
    if (pOrderId && pOrderId !== 'new') {
      setOrderId(pOrderId)
    }
  }, [pOrderId])

  useEffect(() => {
    if (
      order &&
      !order.UserId &&
      userService &&
      userService.user &&
      userService.user.id
    ) {
      const UserId = userService.user.id
      UserId &&
        setOrder((prevOrder) => ({
          ...prevOrder,
          UserId
        }))
    }
  }, [userService, order])

  useEffect(() => {
    if (!needToCheckForDiscounts || !order) {
      setNeedToCheckForDiscounts(false)
      return
    }
    if (order && order.OrderLineItems && canApplyMemberDiscount) {
      const discountAmt = order.OrderLineItems.map((li) => {
        let canDiscount = false
        if (li.data && li.data.product && li.selected_unit === 'CS') {
          canDiscount =
            li.data.product.ws_price !== li.data.product.ws_price_cost
        } else if (li.data && li.data.product && li.selected_unit === 'EA') {
          canDiscount = li.data.product.u_price !== li.data.product.u_price_cost
        }
        if (canDiscount && li.data && li.data.product) {
          const price =
            li.selected_unit === 'CS'
              ? Number(li.data.product.ws_price_cost)
              : Number(li.data.product.u_price_cost)

          const total = isNaN(Number(li.total)) ? 0 : Number(li.total)
          const qty = isNaN(Number(li.quantity)) ? 1 : Number(li.quantity)
          return +(total - price * qty).toFixed(2)
        } else {
          return 0
        }
      }).reduce((acc, v) => acc + v, 0)

      if (discountAmt > 0) {
        const discountPrice = -discountAmt.toFixed(2)
        const discount = order.OrderLineItems.filter(
          (li) =>
            li.kind === 'adjustment' && li.description === 'member discount'
        )[0]
        if (discount) {
          if (discount.total !== discountPrice) {
            const idx = order.OrderLineItems.indexOf(discount)
            // const description = discounts[0].description || ''
            updateLineItem(idx, {
              ...discount,
              price: discountPrice,
              total: discountPrice
            })
          }
        } else {
          const adjustment: LineItem = {
            description: 'member discount',
            quantity: 1,
            price: discountPrice,
            total: discountPrice,
            kind: 'adjustment'
          }
          setOrder((prevOrder) => ({
            ...prevOrder,
            OrderLineItems: [...prevOrder.OrderLineItems, adjustment]
          }))
        }
      }
    }

    setNeedToCheckForDiscounts(false)
  }, [needToCheckForDiscounts, order, canApplyMemberDiscount])

  const handleSnackClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackOpen(false)
  }

  function onAddLineitem(value: { name: string; product: Product }) {
    if (!value) {
      return
    }
    const { product } = value
    if (value && value.name && product) {
      const lineItem: LineItem = {
        description: `${product.name} ${product.description}`,
        quantity: 1,
        selected_unit: 'CS',
        price: parseFloat(`${product.ws_price}`),
        total: parseFloat(`${product.ws_price}`),
        kind: 'product',
        vendor: product.vendor,
        data: { product } as LineItem['data'] // ffffuck why tsc, whhhhy
      }
      setOrder((order) => ({
        ...order,
        item_count:
          order.OrderLineItems.filter((li) => li.kind === 'product').length + 1,
        OrderLineItems: [...order.OrderLineItems, lineItem]
      }))
      setNeedToCheckForDiscounts(true)
    }
  }

  function updateLineItem(idx: number, line_item: LineItem) {
    setOrder((prevOrder) => {
      let orderLineItems = prevOrder.OrderLineItems
      orderLineItems.splice(idx, 1, line_item)

      return {
        ...prevOrder,
        OrderLineItems: orderLineItems
      }
    })
  }
  function onLineItemUpdated(idx: number, line_item: LineItem) {
    updateLineItem(idx, line_item)
    setNeedToCheckForDiscounts(true)
  }
  function removeLineItem(idx: number) {
    if (idx > -1) {
      const li = order.OrderLineItems[idx]
      if (li.kind === 'adjustment' && li.description === 'member discount') {
        setCanApplyMemberDiscount(false)
      }
    }
    setOrder((prevOrder) => {
      const orderLineItems = prevOrder.OrderLineItems
      orderLineItems.splice(idx, 1)
      const item_count = orderLineItems.filter(
        (li) => li.kind === 'product'
      ).length
      return {
        ...prevOrder,
        item_count,
        OrderLineItems: orderLineItems
      }
    })
  }

  function createAdjustment(event: any) {
    const adjustment: LineItem = {
      description: 'new adjustment',
      quantity: 1,
      price: 0.0,
      total: 0.0,
      kind: 'adjustment'
    }
    setOrder((prevOrder) => ({
      ...prevOrder,
      OrderLineItems: [...prevOrder.OrderLineItems, adjustment]
    }))
  }

  function createPayment(event: any) {
    const price = Number(order.total?.toFixed(2)) || -0.0
    const payment: LineItem = {
      description: 'payment',
      quantity: 1,
      price: -price,
      total: -price,
      kind: 'payment'
    }
    setOrder((prevOrder) => ({
      ...prevOrder,
      OrderLineItems: [...prevOrder.OrderLineItems, payment]
    }))
  }

  function createCreditClick(event: any) {
    createCredit(-1, 'credit')
  }

  function createCredit(li_total: number, description: string) {
    const absPrice = Math.abs(parseFloat(`${li_total}`))
    const price = -absPrice
    const total = -(absPrice + absPrice * TAX_RATE)
    const credit: LineItem = {
      description,
      quantity: 1,
      price: -parseFloat(Math.abs(price).toFixed(2)),
      total: -parseFloat(Math.abs(total).toFixed(2)),
      kind: 'credit'
    }
    setOrder((prevOrder) => ({
      ...prevOrder,
      OrderLineItems: [...prevOrder.OrderLineItems, credit]
    }))
  }

  function createCreditFromLineItem(line_item: LineItem) {
    createCredit(
      line_item.total || 0,
      `STORE CREDIT (${line_item.description})`
    )
  }

  function applyStoreCredit() {
    const subtotal =
      order && order.subtotal ? order.subtotal : Math.abs(storeCredit)
    const amt = Math.abs(storeCredit) >= subtotal ? -subtotal : storeCredit
    const adjustment: LineItem = {
      description: 'STORE CREDIT',
      quantity: 1,
      price: amt,
      total: amt,
      kind: 'adjustment'
    }
    setOrder((prevOrder) => ({
      ...prevOrder,
      OrderLineItems: [...prevOrder.OrderLineItems, adjustment]
    }))
  }

  // #TODO: hmm, figure this out.
  // function emailReceipt(event: any) {
  //   fetch(`${API_HOST}/orders/resend_email`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     credentials: 'include',
  //     body: JSON.stringify({ orderId: order.id })
  //   })
  //     .then((response) => response.json())
  //     .then((response) => {
  //       if (response.success) {
  //         setSnackMsg(`Re-sent email to ${order.email}`)
  //       } else {
  //         setSnackMsg(`onoz! could not send email to ${order.email}`)
  //       }
  //     })
  //     .catch((e) => {
  //       console.warn('onoz! caught error re-sending email:', e)
  //       setSnackMsg('onoz! could not re-send email')
  //     })
  //     .finally(() => setSnackOpen(true))
  // }

  function onMembertemSelected(value?: MemberOption) {
    if (value && value.member) {
      const { id, name, phone, address } = value.member // email
      const email =
        value.member.User && value.member.User.email
          ? value.member.User.email
          : value.member.registration_email
      setOrder((prevOrder) => ({
        ...prevOrder,
        name: name || '',
        email: email || '',
        phone: phone || '',
        address: address || '',
        MemberId: id
      }))
      setShowMemberAutocomplete(false)
      if (!id) {
        return
      }
      fetchStoreCredit(id, setStoreCredit)
    }
  }

  const onSaveBtnClick = async (): Promise<void> => {
    const { OrderLineItems: orderLineItems, Members, User, fts, ...o } = order

    setSaving(true)

    if (!orderId || orderId === 'new') {
      const result = await createOrder(o, orderLineItems as SupaOrderLineItem[])
      setSnackOpen(true)
      setSnackMsg('Saved order!')
      setSaving(false)
      if (result && result.id) {
        navigate(`/admin/orders/edit/${result.id}`)
      }
    } else {
      const result = await updateOrder(o, orderLineItems as SupaOrderLineItem[])
      setSnackOpen(true)
      if (!result) {
        setSnackMsg('Oops! Could not update order.')
      } else {
        setSnackMsg('Updated order!')
      }
      if (order.Members?.id) {
        await fetchStoreCredit(order.Members.id, setStoreCredit)
      }

      setSaving(false)
    }
  }

  function onTaxesChange(tax: number) {
    setOrder((prevOrder) => {
      const notTaxLineItems = prevOrder.OrderLineItems.filter(
        (li) => li.kind !== 'tax'
      )

      return {
        ...prevOrder,
        OrderLineItems: [
          ...notTaxLineItems,
          {
            kind: 'tax',
            description: `tax ${TAX_RATE_STRING}`,
            quantity: 1,
            price: tax,
            total: tax
          }
        ]
      }
    })
  }

  function onSubTotalChange(subtotal: number) {
    setOrder((prevOrder) => ({
      ...prevOrder,
      subtotal
    }))
  }

  function onTotalChange(total: number) {
    setOrder((prevOrder) => ({
      ...prevOrder,
      total
    }))
  }

  function valueFor(field: keyof Order) {
    return order && order[field] ? order[field] : ''
  }

  const handleStatusChange = (
    event: React.ChangeEvent<{
      name?: string | undefined
      value: unknown
    }>
  ) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      status: event.target.value as OrderStatus
    }))
  }

  const handlePaymentStatusChange = (
    event: React.ChangeEvent<{
      name?: string | undefined
      value: unknown
    }>
  ) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      payment_status: event.target.value as PaymentStatus
    }))
  }

  const handleShipmentStatusChange = (
    event: React.ChangeEvent<{
      name?: string | undefined
      value: unknown
    }>
  ) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      shipment_status: event.target.value as ShipmentStatus
    }))
  }

  const shouldShowAddMemberDiscount =
    !canApplyMemberDiscount ||
    (order &&
      order.OrderLineItems.filter((li) => li.description === 'member discount')
        .length === 0)

  return (
    <div className={classes.root}>
      {loading ? (
        <Loading />
      ) : (
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid item xs={12} md={4}>
            <div className={classes.sticky}>
              {showMemberAutocomplete ? (
                <div style={{ display: 'flex' }}>
                  <Tooltip title="close">
                    <IconButton
                      aria-label="close"
                      onClick={() => setShowMemberAutocomplete(false)}
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </Tooltip>
                  <MemberAutocomplete onItemSelected={onMembertemSelected} />
                </div>
              ) : (
                <div className={classes.orderSideHeading}>
                  <Tooltip title="BACK TO ORDERS">
                    <IconButton
                      aria-label="back to orders"
                      onClick={() => navigate('/admin/orders')}
                    >
                      <Icon>arrow_back</Icon>
                    </IconButton>
                  </Tooltip>

                  <h2 style={{ display: 'inline-block' }}>
                    {orderId && orderId !== 'new' ? (
                      <>
                        EDIT ORDER <i>#{order.id}</i>
                      </>
                    ) : (
                      'CREATE ORDER'
                    )}
                  </h2>

                  <div className={classes.saveBtn}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onSaveBtnClick}
                      disabled={saving}
                      fullWidth
                    >
                      Save
                    </Button>
                  </div>
                  <div>
                    <Tooltip title="ADD USER DETAILS">
                      <IconButton
                        aria-label="add user details"
                        onClick={() => setShowMemberAutocomplete(true)}
                      >
                        <Icon>people</Icon>
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>

            {order?.Members?.discount && order.Members.discount > 0 && (
              <Box color="info.main">
                <Typography variant="overline" display="block" gutterBottom>
                  Member has discount:{' '}
                  <b>
                    {order.Members.discount}{' '}
                    {order.Members.discount_type &&
                      `(${order.Members.discount_type})`}
                  </b>
                </Typography>
              </Box>
            )}
            {storeCredit !== 0 && (
              <Box color="info.main">
                <Typography variant="overline" display="block" gutterBottom>
                  Member has store credit:
                  <Tooltip title="apply store credit">
                    <Button
                      aria-label="apply store credit"
                      size="large"
                      onClick={() => applyStoreCredit()}
                    >
                      {storeCredit}
                    </Button>
                  </Tooltip>
                </Typography>
              </Box>
            )}
            <form className={classes.form} noValidate autoComplete="off">
              <TextField
                label="name"
                type="text"
                className={classes.formInput}
                fullWidth
                value={order.name}
                onChange={(event: any) => {
                  event.persist()
                  setOrder((order) => ({ ...order, name: event.target.value }))
                }}
              />
              <TextField
                label="email"
                type="email"
                className={classes.formInput}
                fullWidth
                value={order.email}
                onChange={(event: any) => {
                  event.persist()
                  setOrder((order) => ({ ...order, email: event.target.value }))
                }}
              />
              <TextField
                label="phone"
                type="phone"
                className={classes.formInput}
                fullWidth
                value={order.phone}
                onChange={(event: any) => {
                  event.persist()
                  setOrder((order) => ({ ...order, phone: event.target.value }))
                }}
              />
              <TextField
                label="address"
                type="text"
                className={classes.formInput}
                fullWidth
                value={order.address}
                onChange={(event: any) => {
                  event.persist()
                  setOrder((order) => ({
                    ...order,
                    address: event.target.value
                  }))
                }}
              />
              <TextField
                label="notes"
                className={classes.formInput}
                multiline
                rowsMax="20"
                fullWidth
                value={order.notes}
                onChange={(event: any) => {
                  event.persist()
                  setOrder((order) => ({ ...order, notes: event.target.value }))
                }}
              />

              <FormControl fullWidth className={classes.status}>
                <InputLabel id="order-status-select-label">status</InputLabel>
                <Select
                  labelId="order-status-select-label"
                  id="order-status-select"
                  value={valueFor('status')}
                  onChange={handleStatusChange}
                >
                  {Object.keys(ORDER_STATUSES).map((status) => (
                    <MenuItem key={`os-sel-${status}`} value={status}>
                      {ORDER_STATUSES[status as OrderStatus]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth className={classes.status}>
                <InputLabel id="payment-status-select-label">
                  payment status
                </InputLabel>
                <Select
                  labelId="payment-status-select-label"
                  id="payment-status-select"
                  value={valueFor('payment_status')}
                  onChange={handlePaymentStatusChange}
                >
                  {Object.keys(PAYMENT_STATUSES).map((status) => (
                    <MenuItem key={`ps-sel-${status}`} value={status}>
                      {PAYMENT_STATUSES[status as PaymentStatus]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth className={classes.status}>
                <InputLabel id="shipment-status-select-label">
                  shipment status
                </InputLabel>
                <Select
                  labelId="shipment-status-select-label"
                  id="shipment-status-select"
                  value={valueFor('shipment_status')}
                  onChange={handleShipmentStatusChange}
                >
                  {Object.keys(SHIPMENT_STATUSES).map((status) => (
                    <MenuItem key={`ship-sel-${status}`} value={status}>
                      {SHIPMENT_STATUSES[status as ShipmentStatus]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </form>
          </Grid>
          <Grid item xs={12} md={8}>
            <div>
              {showLiAutocomplete ? (
                <div style={{ display: 'flex' }}>
                  <Tooltip title="close">
                    <IconButton
                      aria-label="close"
                      onClick={() => setShowLiAutocomplete(false)}
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </Tooltip>
                  <LineItemAutocomplete onItemSelected={onAddLineitem} />
                </div>
              ) : (
                <>
                  <Button
                    aria-label="add line items"
                    size="large"
                    onClick={() => setShowLiAutocomplete(true)}
                  >
                    <Icon>add</Icon>
                    LINE ITEMS
                  </Button>

                  <Button
                    aria-label="add adjustment"
                    size="large"
                    onClick={createAdjustment}
                  >
                    <Icon>add</Icon>
                    ADJUSTMENT
                  </Button>

                  {shouldShowAddMemberDiscount && (
                    <Button
                      aria-label="add member discount"
                      size="large"
                      onClick={() => {
                        setCanApplyMemberDiscount(true)
                        setNeedToCheckForDiscounts(true)
                      }}
                    >
                      <Icon>add</Icon>
                      MEMBER DISCOUNT
                    </Button>
                  )}

                  <Button
                    aria-label="add payment"
                    size="large"
                    onClick={createPayment}
                  >
                    <Icon>add</Icon>
                    PAYMENT
                  </Button>

                  <Button
                    aria-label="add credit"
                    size="large"
                    onClick={createCreditClick}
                  >
                    <Icon>add</Icon>
                    CREDIT
                  </Button>

                  {/* <Button
                    aria-label="email receipt"
                    size="large"
                    onClick={emailReceipt}
                  >
                    <EmailIcon className={classes.emailIcon} />
                    email receipt
                  </Button> */}
                </>
              )}
            </div>
            <OrderLineItems
              line_items={order.OrderLineItems.map((oli) => ({
                ...oli,
                price: tryNumber(oli.price),
                quantity: tryNumber(oli.quantity),
                total: tryNumber(oli.total)
              }))}
              onLineItemUpdated={onLineItemUpdated}
              removeLineItem={removeLineItem}
              onTaxesChange={onTaxesChange}
              onTotalChange={onTotalChange}
              onSubTotalChange={onSubTotalChange}
              createCreditFromLineItem={createCreditFromLineItem}
            />
          </Grid>
        </Grid>
      )}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={<span id="message-id">{snackMsg}</span>}
        action={[
          <IconButton key="close" aria-label="close" onClick={handleSnackClose}>
            <Icon>close</Icon>
          </IconButton>
        ]}
      />
    </div>
  )
}