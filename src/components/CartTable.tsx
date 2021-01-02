import React, { useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'

import { updateLineItem, removeItemFromCart } from '../services/useCartService'
import { Order, OrderLineItem } from '../types/Order'
import { TAX_RATE, TAX_RATE_STRING } from '../constants'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '95vw',
      padding: theme.spacing(1),
      borderCollapse: 'separate',
      '& td': {
        border: 'none'
      }
    },
    qtyinput: {
      width: '50px'
    }
  })
)

function usdFormat(num?: number | string) {
  if (num === undefined) {
    return '$0.00'
  } else if (typeof num === 'string') {
    return `$${parseFloat(num).toFixed(2)}`
  } else {
    return `$${num.toFixed(2)}`
  }
}

function subtotal(items: OrderLineItem[]) {
  return items
    .map(({ total }) => total)
    .reduce((sum, i) => sum + parseFloat(`${i}`), 0)
}

function liTotal(line_item: OrderLineItem): number {
  const product = line_item.data && line_item.data.product
  if (product) {
    return line_item.selected_unit === 'EA' && product.u_price
      ? line_item.quantity * parseFloat(product.u_price)
      : line_item.quantity * parseFloat(product.ws_price)
  } else {
    return line_item.quantity * (line_item.price || 0)
  }
}

function liPkSize(line_item: OrderLineItem): string {
  const product = line_item.data && line_item.data.product
  if (product) {
    const pksize = []
    product.pk && product.pk !== 1 && pksize.push(product.pk)
    product.size && pksize.push(product.size)
    return pksize.join(' / ')
  } else {
    return ''
  }
}

interface CartTableProps {
  line_items: OrderLineItem[]
  emptyCartAndCloseDrawer?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void
  closeDrawer?: () => void
  setOrder?: React.Dispatch<React.SetStateAction<Order>>
  checkout?: boolean
  summary?: boolean
}

function CartTable(props: CartTableProps & RouteComponentProps) {
  const narrowWidth = useMediaQuery('(max-width:600px)')
  const classes = useStyles()

  const { checkout, summary, setOrder } = props
  const invoiceSubtotal = subtotal(props.line_items)
  const invoiceTaxes = TAX_RATE * invoiceSubtotal
  const invoiceTotal = invoiceTaxes + invoiceSubtotal

  useEffect(() => {
    if (setOrder) {
      setOrder((order) => {
        const newOrder = {
          ...order,
          subtotal: +invoiceSubtotal.toFixed(2),
          total: +invoiceTotal.toFixed(2),
          item_count: order.OrderLineItems.filter((li) => li.kind === 'product')
            .length,
          OrderLineItems: [
            ...order.OrderLineItems.filter((li) => li.kind !== 'tax'),
            {
              kind: 'tax',
              description: TAX_RATE_STRING,
              quantity: 1,
              total: +invoiceTaxes.toFixed(2)
            }
          ]
        }
        return newOrder
      })
    }
  }, [setOrder, invoiceSubtotal, invoiceTaxes, invoiceTotal])

  const handleUnitChange = (line_item: OrderLineItem, unit: string) => {
    line_item.selected_unit = unit
    line_item.total = liTotal(line_item)
    updateLineItem(line_item)
  }

  const handleQtyChange = (line_item: OrderLineItem, quantity: number) => {
    line_item.quantity = quantity > 0 ? quantity : 1
    line_item.total = liTotal(line_item)
    updateLineItem(line_item)
  }

  const removeLineItem = (id?: number) => {
    id && removeItemFromCart(id)
  }

  const products = props.line_items.filter(
    (li) => li.kind === 'product' && !li.invalid
  )
  const invalidProducts = props.line_items.filter(
    (li) => li.kind === 'product' && li.invalid
  )
  const adjustments = props.line_items.filter((li) => li.kind === 'adjustment')

  return (
    <Table className={classes.root} aria-label="cart">
      <TableHead>
        <TableRow>
          <TableCell align="center"></TableCell>
          <TableCell>Description</TableCell>
          <TableCell align="right">Price</TableCell>
          <TableCell align="center">Unit</TableCell>
          <TableCell align="right">Qty.</TableCell>
          <TableCell align="right">Total</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((line_item, idx) => (
          <TableRow key={`li${idx}`}>
            <TableCell align="center">
              {!summary && (
                <Tooltip
                  aria-label="remove line item"
                  title={`REMOVE ${line_item.description}`}
                >
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={(event: any) => removeLineItem(line_item.id)}
                  >
                    <ClearIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              )}
            </TableCell>
            <TableCell>
              {line_item.description}

              {!isNaN(
                parseInt(`${line_item?.data?.product?.count_on_hand}`)
              ) && (
                <>
                  <br />
                  <i>
                    {line_item?.data?.product?.no_backorder && 'ONLY '}
                    {line_item?.data?.product?.count_on_hand} ON HAND
                    {line_item?.data?.product?.no_backorder && ' LEFT'}
                  </i>
                </>
              )}
            </TableCell>
            <TableCell align="right">
              <div>{usdFormat(line_item.price)}</div>
              <div>{liPkSize(line_item)}</div>
            </TableCell>
            <TableCell align="center">
              {!summary ? (
                line_item.data &&
                line_item.data.product &&
                line_item.data.product.u_price &&
                line_item.data.product.u_price !==
                  line_item.data.product.ws_price ? (
                  <Select
                    value={line_item.selected_unit}
                    onChange={(event: any) =>
                      handleUnitChange(line_item, event.target.value)
                    }
                    margin="dense"
                  >
                    <MenuItem value="CS">Case</MenuItem>
                    <MenuItem value="EA">Each</MenuItem>
                  </Select>
                ) : line_item.data &&
                  line_item.data.product &&
                  line_item.data.product.unit_type === 'CS' ? (
                  'Case'
                ) : (
                  'Each'
                )
              ) : (
                line_item.selected_unit
              )}
            </TableCell>
            <TableCell align="right">
              {!summary ? (
                <TextField
                  className={classes.qtyinput}
                  type="number"
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="dense"
                  fullWidth
                  value={line_item.quantity}
                  onChange={(event: any) =>
                    handleQtyChange(line_item, parseInt(event.target.value))
                  }
                  inputProps={{
                    min: '1',
                    step: '1'
                  }}
                />
              ) : (
                line_item.quantity
              )}
            </TableCell>
            <TableCell align="right">{usdFormat(line_item.total)}</TableCell>
          </TableRow>
        ))}

        {invalidProducts && invalidProducts.length > 0 && (
          <TableRow>
            <TableCell colSpan={5}>Out Of Stock</TableCell>
          </TableRow>
        )}
        {invalidProducts.map((line_item, idx) => (
          <TableRow key={`invalidProduct${idx}`}>
            <TableCell align="center">
              {!summary && (
                <Tooltip
                  aria-label="remove line item"
                  title={`REMOVE ${line_item.description}`}
                >
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={(event: any) => removeLineItem(line_item.id)}
                  >
                    <ClearIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              )}
            </TableCell>
            <TableCell>{line_item.description}</TableCell>

            <TableCell align="right">
              <div>{usdFormat(line_item.price)}</div>
              <div>{liPkSize(line_item)}</div>
            </TableCell>

            <TableCell align="center">{line_item.selected_unit}</TableCell>
            <TableCell align="right">{line_item.quantity}</TableCell>
            <TableCell align="right">{usdFormat(line_item.total)}</TableCell>
          </TableRow>
        ))}

        {adjustments && adjustments.length > 0 && (
          <TableRow>
            <TableCell colSpan={5}>Adjustments</TableCell>
          </TableRow>
        )}

        {adjustments.map((line_item, idx) => (
          <TableRow key={`li${idx}`}>
            <TableCell align="center">
              {!summary && (
                <Tooltip aria-label="remove line item" title="REMOVE LINE ITEM">
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={(event: any) => removeLineItem(line_item.id)}
                  >
                    <ClearIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              )}
            </TableCell>
            <TableCell>{line_item.description}</TableCell>
            <TableCell align="right">
              <div>{usdFormat(line_item.price)}</div>
              <div>{liPkSize(line_item)}</div>
            </TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="right">{line_item.quantity}</TableCell>
            <TableCell align="right">{usdFormat(line_item.total)}</TableCell>
          </TableRow>
        ))}

        <TableRow>
          <TableCell rowSpan={3} colSpan={3} />
          <TableCell>Subtotal</TableCell>
          <TableCell align="right">
            {props.line_items && props.line_items.length}
          </TableCell>
          <TableCell align="right">{usdFormat(invoiceSubtotal)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Tax</TableCell>
          <TableCell align="right">{TAX_RATE_STRING}</TableCell>
          <TableCell align="right">{usdFormat(invoiceTaxes)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell align="right" colSpan={2}>
            <b>{usdFormat(invoiceTotal)}</b>
          </TableCell>
        </TableRow>
      </TableBody>
      {!summary && !checkout && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} align="left">
              {props.emptyCartAndCloseDrawer && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={props.emptyCartAndCloseDrawer}
                >
                  Empty Cart
                </Button>
              )}
            </TableCell>
            <TableCell colSpan={3} align="right">
              <Button
                variant="contained"
                color="primary"
                onClick={() => props.history.push('/checkout')}
              >
                Checkout
              </Button>
            </TableCell>
          </TableRow>
          {narrowWidth && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Button
                  variant="contained"
                  onClick={() => props.closeDrawer && props.closeDrawer()}
                >
                  Continue Shopping
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableFooter>
      )}
    </Table>
  )
}

export default withRouter(CartTable)
