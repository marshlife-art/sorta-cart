import { Checkbox, FormControlLabel, Icon } from '@material-ui/core'
import {
  SupaOrderLineItem as LineItem,
  SupaProduct,
  SupaWholesaleOrder as WholesaleOrder
} from '../../../types/SupaTypes'
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  SHIPMENT_STATUSES
} from '../../../constants'
import {
  OrderStatus,
  PaymentStatus,
  ShipmentStatus
} from '../../../types/Order'
import React, { useEffect, useState } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import {
  deleteWholesaleOrder,
  updateOrderLineItems
} from '../../../services/mutations'
import { useMatch, useNavigate } from 'react-router-dom'
import {
  useWholesaleOrderSaveService,
  useWholesaleOrderService
} from './useWholesaleOrderService'

import EditMenu from './EditMenu'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import Loading from '../../Loading'
import MenuItem from '@material-ui/core/MenuItem'
import { Parser } from 'json2csv'
import Select from '@material-ui/core/Select'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import WholesaleOrderLineItems from './WholesaleOrderLineItems'
import { formatRelative } from 'date-fns'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    vendor: {
      marginBottom: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    editMenu: {
      padding: `${theme.spacing(2)}px 0`,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
    }
  })
)

export interface GroupedItem {
  qtySum: number
  qtyUnits: number
  qtyAdjustments: number
  totalSum: number
  product: SupaProduct | undefined | null
  vendor: string | undefined
  description: string
  line_items: LineItem[]
}

export interface LineItemData {
  groupedLineItems: {
    [key: string]: GroupedItem
  }
  orderTotal: number
  productTotal: number
  adjustmentTotal: number
}

interface EditWholesaleOrderProps {
  setReloadOrders: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EditWholesaleOrder(props: EditWholesaleOrderProps) {
  const navigate = useNavigate()
  const match = useMatch('/admin/wholesaleorders/edit/:id')
  const classes = useStyles()

  const [wholesaleOrderId, setWholesaleOrderId] = useState('')
  const [wholesaleOrder, setWholesaleOrder] = useState<WholesaleOrder>()
  const [loading, setLoading] = useState(true)
  const [doSave, setDoSave] = useState(false)
  const [reload, setReload] = useState(true)

  const [lineItemData, setLineItemData] = useState<LineItemData>({
    groupedLineItems: {},
    productTotal: 0,
    adjustmentTotal: 0,
    orderTotal: 0
  })

  const wholesaleOrderService = useWholesaleOrderService(
    wholesaleOrderId,
    setLoading,
    reload,
    setReload
  )

  useEffect(() => {
    if (wholesaleOrderService.status === 'loaded') {
      if (wholesaleOrderService.payload) {
        setWholesaleOrder(wholesaleOrderService.payload)
      }
    }
  }, [wholesaleOrderService, wholesaleOrderId])

  const [snackOpen, setSnackOpen] = React.useState(false)
  const [snackMsg, setSnackMsg] = React.useState('')

  const handleOrderNotesChange = (notes?: string) => {
    setWholesaleOrder((prevOrder) => {
      if (prevOrder) {
        return {
          ...prevOrder,
          notes
        }
      }
    })
  }

  const handleOrderVendorChange = (vendor: string) => {
    setWholesaleOrder((prevOrder) => {
      if (prevOrder) {
        return {
          ...prevOrder,
          vendor
        }
      }
    })
  }

  const handleStatusChange = (status: OrderStatus) => {
    setWholesaleOrder((prevOrder) => {
      if (prevOrder) {
        return {
          ...prevOrder,
          status
        }
      }
    })
  }

  const handlePaymentStatusChange = (payment_status: PaymentStatus) => {
    setWholesaleOrder((prevOrder) => {
      if (prevOrder) {
        return {
          ...prevOrder,
          payment_status
        }
      }
    })
  }

  const handleShipmentStatusChange = (shipment_status: ShipmentStatus) => {
    setWholesaleOrder((prevOrder) => {
      if (prevOrder) {
        return {
          ...prevOrder,
          shipment_status
        }
      }
    })
  }

  const handleCalcAdjustmentsChange = (calc_adjustments: boolean) => {
    setWholesaleOrder((prevOrder) => {
      if (prevOrder) {
        return {
          ...prevOrder,
          calc_adjustments
        }
      }
    })
  }

  const handleDataChange = (data: any) => {
    setWholesaleOrder((prevOrder) => {
      if (prevOrder) {
        return {
          ...prevOrder,
          data
        }
      }
    })
  }

  const handleSnackClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackOpen(false)
  }

  useEffect(() => {
    if (lineItemData) {
      handleDataChange(lineItemData)
    }
  }, [lineItemData])

  const id = match?.params?.id

  useEffect(() => {
    if (id) {
      setWholesaleOrderId(id)
    }
  }, [id])

  const onSaveBtnClick = (): void => {
    if (wholesaleOrderId === 'new') {
      setWholesaleOrder((prevOrder) => {
        if (prevOrder) {
          return {
            ...prevOrder,
            id: undefined
          }
        }
      })
    }
    setDoSave(true)
    props.setReloadOrders(true)
  }

  useWholesaleOrderSaveService(
    wholesaleOrder,
    doSave,
    setDoSave,
    setSnackMsg,
    setSnackOpen
  )

  const onDeleteBtnClick = async (): Promise<void> => {
    if (!wholesaleOrder || wholesaleOrder.id === undefined) {
      return
    }

    const { error, status } = await updateOrderLineItems(
      { WholesaleOrderId: null },
      [wholesaleOrder.id]
    )

    if (error && status !== 404) {
      console.warn('delete wholesale firstUpdateOLI order caught error:', error)
      setSnackMsg(error.message)
      setSnackOpen(true)
      return
    }

    const { error: deleteError } = await deleteWholesaleOrder(wholesaleOrder.id)

    if (deleteError) {
      console.warn('delete wholesale order caught error:', deleteError)
      setSnackMsg(deleteError.message)
      setSnackOpen(true)
    } else {
      navigate('/admin/wholesaleorders')
    }
  }

  const saveStreamCSV = (filename: string, text: any) => {
    // lolol shoutout to https://stackoverflow.com/questions/37095233/downloading-and-saving-data-with-fetch-from-authenticated-rest

    // if (window.navigator.msSaveBlob) {
    //   // IE 10 and later, and Edge.
    //   const blobObject = new Blob([text], { type: 'text/csv' })
    //   window.navigator.msSaveBlob(blobObject, filename)
    // } else {
    // Everthing else (except old IE).
    // Create a dummy anchor (with a download attribute) to click.
    const anchor = document.createElement('a')
    anchor.download = filename
    if (window.URL.createObjectURL) {
      // Everything else new.
      const blobObject = new Blob([text], { type: 'text/csv' })
      anchor.href = window.URL.createObjectURL(blobObject)
    } else {
      // Fallback for older browsers (limited to 2MB on post-2010 Chrome).
      // Load up the data into the URI for "download."
      anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(text)
    }
    // Now, click it.
    if (document.createEvent) {
      const event = document.createEvent('MouseEvents')
      event.initEvent('click', true, true)
      anchor.dispatchEvent(event)
    } else {
      anchor.click()
    }
    // }
  }

  const onProductsExportToCsv = (): void => {
    const vendor = wholesaleOrder && wholesaleOrder.vendor
    if (!vendor) {
      return
    }
    const json2csvParser = new Parser({
      fields: [
        { value: 'product.unf', label: 'unf' },
        { value: 'product.upc_code', label: 'upc_code' },
        { value: 'product.plu', label: 'plu' },
        { value: 'vendor', label: 'vendor' },
        { value: 'description', label: 'description' },
        { value: 'qtySum', label: 'qtySum' },
        { value: 'qtyUnits', label: 'units ordered' },
        { value: 'qtyAdjustments', label: 'on_hand_count_change' },
        { value: 'totalSum', label: 'totalSum' },
        { value: 'product.ws_price_cost', label: 'ws_price_cost' },
        { value: 'product.u_price_cost', label: 'u_price_cost' },
        { value: 'product.pk', label: 'pk' },
        { value: 'product.size', label: 'size' },
        { value: 'product.unit_type', label: 'unit_type' },
        { value: 'product.category', label: 'category' },
        { value: 'product.sub_category', label: 'sub_category' },
        { value: 'product.name', label: 'name' },
        { value: 'product.description', label: 'description' },
        { value: 'product.count_on_hand', label: 'count_on_hand' }
      ]
    })
    const csvout = json2csvParser.parse(
      Object.values(lineItemData.groupedLineItems)
    )
    saveStreamCSV(`${vendor}.csv`, csvout)
  }

  function valueFor(field: keyof WholesaleOrder) {
    return wholesaleOrder && wholesaleOrder[field] ? wholesaleOrder[field] : ''
  }

  return wholesaleOrder ? (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
          >
            <Grid item sm={5}>
              <TextField
                className={classes.vendor}
                label="vendor"
                fullWidth
                value={valueFor('vendor')}
                onChange={(event) =>
                  handleOrderVendorChange(event.target.value)
                }
              />
              <FormControl fullWidth>
                <InputLabel id="order-status-select-label">status</InputLabel>
                <Select
                  labelId="order-status-select-label"
                  id="order-status-select"
                  value={valueFor('status')}
                  onChange={(event) =>
                    handleStatusChange(event.target.value as OrderStatus)
                  }
                >
                  {Object.keys(ORDER_STATUSES).map((status) => (
                    <MenuItem key={`os-sel-${status}`} value={status}>
                      {ORDER_STATUSES[status as OrderStatus]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="payment-status-select-label">
                  payment status
                </InputLabel>
                <Select
                  labelId="payment-status-select-label"
                  id="payment-status-select"
                  value={valueFor('payment_status')}
                  onChange={(event) =>
                    handlePaymentStatusChange(
                      event.target.value as PaymentStatus
                    )
                  }
                >
                  {Object.keys(PAYMENT_STATUSES).map((status) => (
                    <MenuItem key={`ps-sel-${status}`} value={status}>
                      {PAYMENT_STATUSES[status as PaymentStatus]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="shipment-status-select-label">
                  shipment status
                </InputLabel>
                <Select
                  labelId="shipment-status-select-label"
                  id="shipment-status-select"
                  value={valueFor('shipment_status')}
                  onChange={(event) =>
                    handleShipmentStatusChange(
                      event.target.value as ShipmentStatus
                    )
                  }
                >
                  {Object.keys(SHIPMENT_STATUSES).map((status) => (
                    <MenuItem key={`ship-sel-${status}`} value={status}>
                      {SHIPMENT_STATUSES[status as ShipmentStatus]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={7}>
              <TextField
                label="notes"
                multiline
                fullWidth
                rows={6}
                rowsMax={28}
                value={valueFor('notes')}
                onChange={(event) => handleOrderNotesChange(event.target.value)}
              />
              <div>
                {wholesaleOrder.updatedAt && (
                  <div>
                    last updated:{' '}
                    {formatRelative(
                      new Date(wholesaleOrder.updatedAt),
                      Date.now()
                    )}
                  </div>
                )}
              </div>

              <div className={classes.editMenu}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                        checked: boolean
                      ) => {
                        handleCalcAdjustmentsChange(checked)
                      }}
                      checked={!!valueFor('calc_adjustments')}
                      value="calc_adjustments"
                      disabled={wholesaleOrder.status === 'pending'}
                    />
                  }
                  label="Calculate Adjustments"
                />
                <EditMenu
                  wholesaleOrder={wholesaleOrder}
                  onSaveBtnClick={onSaveBtnClick}
                  onDeleteBtnClick={onDeleteBtnClick}
                  onProductsExportToCsv={onProductsExportToCsv}
                />
              </div>
            </Grid>
          </Grid>
          <WholesaleOrderLineItems
            wholesaleOrder={wholesaleOrder}
            setReload={setReload}
            lineItemData={lineItemData}
            setLineItemData={setLineItemData}
            setSnackMsg={setSnackMsg}
            setSnackOpen={setSnackOpen}
            calcAdjustments={!!valueFor('calc_adjustments')}
          />
        </>
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
    </>
  ) : (
    <Loading />
  )
}
