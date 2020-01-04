import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'

import {
  // useCartService,
  // emptyCart,
  updateLineItem,
  removeItemFromCart
} from '../services/useCartService'
import { LineItem } from '../types/Product'
import { TAX_RATE, TAX_RATE_STRING } from '../constants'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflowX: 'auto',
      height: '100%'
    },
    table: {
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

function usdFormat(num: number | string) {
  if (typeof num === 'string') {
    return `$${parseFloat(num).toFixed(2)}`
  } else {
    return `$${num.toFixed(2)}`
  }
}

function subtotal(items: LineItem[]) {
  return items.map(({ total }) => total).reduce((sum, i) => sum + i, 0)
}

function liTotal(line_item: LineItem): number {
  return line_item.selected_unit === 'EA' && line_item.u_price
    ? line_item.quantity * parseFloat(line_item.u_price)
    : line_item.quantity * parseFloat(line_item.ws_price)
}

function liPkSize(line_item: LineItem): string {
  const pksize = []
  line_item.pk && line_item.pk !== 1 && pksize.push(line_item.pk)
  line_item.size && pksize.push(line_item.size)
  return pksize.join(' / ')
}

interface CartTableProps {
  line_items: LineItem[]
  emptyCartAndCloseDrawer?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void
  checkout?: boolean
  summary?: boolean
}

function CartTable(props: CartTableProps & RouteComponentProps) {
  const classes = useStyles()

  const { checkout, summary } = props
  const invoiceSubtotal = subtotal(props.line_items)
  const invoiceTaxes = TAX_RATE * invoiceSubtotal
  const invoiceTotal = invoiceTaxes + invoiceSubtotal

  const handleUnitChange = (line_item: LineItem, unit: string) => {
    line_item.selected_unit = unit
    line_item.total = liTotal(line_item)
    updateLineItem(line_item)
  }

  const handleQtyChange = (line_item: LineItem, quantity: number) => {
    line_item.quantity = quantity > 0 ? quantity : 1
    line_item.total = liTotal(line_item)
    updateLineItem(line_item)
  }

  const removeLineItem = (id: number) => {
    removeItemFromCart(id)
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="cart">
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
          {props.line_items.map((line_item, idx) => (
            <TableRow key={`li${idx}`}>
              <TableCell align="center">
                {!summary && (
                  <Tooltip
                    aria-label="remove line item"
                    title="REMOVE LINE ITEM"
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
                {line_item.name} {line_item.description}
              </TableCell>
              <TableCell align="right">
                <div>
                  {line_item.selected_unit === 'EA' && line_item.u_price
                    ? usdFormat(line_item.u_price)
                    : usdFormat(line_item.ws_price)}
                </div>
                <div>{liPkSize(line_item)}</div>
              </TableCell>
              <TableCell align="center">
                {!summary ? (
                  line_item.u_price &&
                  line_item.u_price !== line_item.ws_price ? (
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
                  ) : line_item.unit_type === 'CS' ? (
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
                      handleQtyChange(line_item, event.target.value)
                    }
                    inputProps={{ min: '1', step: '1' }}
                  />
                ) : (
                  line_item.quantity
                )}
              </TableCell>
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
          </TableFooter>
        )}
      </Table>
    </Paper>
  )
}

export default withRouter(CartTable)
