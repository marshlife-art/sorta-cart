import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import { useCartService, emptyCart } from '../services/useCartService'
import { LineItem } from '../types/Product'

interface CartDrawerProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TAX_RATE = 0.07

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflowX: 'auto',
      height: '100%'
    },
    table: {
      maxWidth: '95vw'
      // padding: theme.spacing(6)
      // minWidth: 700
    }
  })
)

function ccyFormat(num: number | string) {
  if (typeof num === 'string') {
    return `$${parseFloat(num).toFixed(2)}`
  } else {
    return `$${num.toFixed(2)}`
  }
}

// function priceRow(quantity: number, price: number) {
//   return quantity * price
// }

function subtotal(items: LineItem[]) {
  return items
    .map(({ ws_price }) => parseFloat(ws_price))
    .reduce((sum, i) => sum + i, 0)
}

function CartTable(props: {
  line_items: LineItem[]
  emptyCartAndCloseDrawer: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void
}) {
  const classes = useStyles()
  const invoiceSubtotal = subtotal(props.line_items)
  const invoiceTaxes = TAX_RATE * invoiceSubtotal
  const invoiceTotal = invoiceTaxes + invoiceSubtotal

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="cart">
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.line_items.map((line_item, idx) => (
            <TableRow key={`li${idx}`}>
              <TableCell>
                {line_item.name} {line_item.description}
              </TableCell>
              <TableCell align="right">{line_item.quantity}</TableCell>
              <TableCell align="right">{line_item.selected_unit}</TableCell>
              <TableCell align="right">
                {ccyFormat(line_item.ws_price)}
              </TableCell>
              <TableCell align="right">{ccyFormat(line_item.total)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={3}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Tax</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(
              0
            )} %`}</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell align="right">
              <b>{ccyFormat(invoiceTotal)}</b>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} align="left">
              <Button
                variant="contained"
                color="secondary"
                onClick={props.emptyCartAndCloseDrawer}
              >
                Empty Cart
              </Button>
            </TableCell>
            <TableCell colSpan={3} align="right">
              <Button variant="contained" color="primary">
                Checkout
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  )
}

function CartDrawer(props: CartDrawerProps) {
  const { open, setOpen } = props

  const cartResult = useCartService()

  const emptyCartAndCloseDrawer = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (window.confirm('Are you sure?')) {
      emptyCart()
      setOpen(false)
    }
  }

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(!open)}>
      {cartResult.status !== 'loaded' && 'Loading...'}
      {cartResult.status === 'loaded' &&
        cartResult.payload.line_items.length > 0 && (
          <CartTable
            line_items={cartResult.payload.line_items}
            emptyCartAndCloseDrawer={emptyCartAndCloseDrawer}
          />
        )}
    </Drawer>
  )
}

export default CartDrawer
