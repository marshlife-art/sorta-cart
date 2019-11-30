import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import { useCartService } from '../services/useCartService'
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
      overflowX: 'auto'
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

function SpanningTable(props: { line_items: LineItem[] }) {
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
      </Table>
    </Paper>
  )
}

function CartDrawer(props: CartDrawerProps) {
  const { open, setOpen } = props

  const cartResult = useCartService()

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(!open)}>
      {cartResult.status !== 'loaded' && 'Loading...'}
      {cartResult.status === 'loaded' && (
        <SpanningTable line_items={cartResult.payload.line_items} />
      )}
    </Drawer>
  )
}

export default CartDrawer
