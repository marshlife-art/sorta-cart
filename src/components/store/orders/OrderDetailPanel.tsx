import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import PaymentDialog from './PaymentDialog'
import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { SuperOrderAndAssoc } from '../../../types/SupaTypes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginRight: theme.spacing(2),
      borderLeft: `${theme.spacing(6)}px solid ${theme.palette.divider}`
    },
    gridHeading: {
      color: theme.palette.text.secondary
    },
    gridItem: {
      paddingBottom: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      textAlign: 'center'
    },
    lastUpdated: {
      marginLeft: theme.spacing(2)
    }
  })
)

export default function OrderDetailPanel(props: {
  order: Partial<SuperOrderAndAssoc>
  setRefetchOrders: React.Dispatch<React.SetStateAction<number>>
}) {
  const classes = useStyles()
  const order = props.order
  const line_items = props.order.OrderLineItems || []
  const adjustments = line_items.filter(
    (li) =>
      li.kind !== 'product' && li.kind !== 'payment' && li.kind !== 'credit'
  )
  const payments = line_items.filter((li) => li.kind === 'payment')
  const paymentsTotal = payments.reduce(
    (acc, v) => acc + parseFloat(`${v.total}`),
    0
  )
  const credits = line_items.filter((li) => li.kind === 'credit')
  const creditsTotal = credits.reduce(
    (acc, v) => acc + parseFloat(`${v.total}`),
    0
  )
  const balance =
    parseFloat(`${order.total}`) +
    parseFloat(`${creditsTotal}`) +
    parseFloat(`${paymentsTotal}`)

  return (
    <div className={classes.root}>
      <Table aria-label="order details table" size="small">
        <TableHead>
          <TableRow>
            <TableCell component="th">
              Line Items ({order.item_count})
            </TableCell>
            <TableCell component="th" align="right">
              price
            </TableCell>
            <TableCell component="th" align="right">
              unit
            </TableCell>
            <TableCell component="th" align="right">
              qty
            </TableCell>
            <TableCell component="th" align="right">
              total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {line_items.map(
            (li, idx) =>
              li.kind === 'product' && (
                <TableRow key={`orderli${idx}`}>
                  <TableCell component="td" scope="row">
                    {li.vendor && `[${li.vendor}] `}
                    {li.description}
                    {li.data && li.data.product
                      ? ` ${li.data.product.unf}`
                      : ''}
                  </TableCell>
                  <TableCell align="right">{li.price}</TableCell>
                  <TableCell align="right">{li.selected_unit}</TableCell>
                  <TableCell align="right">{li.quantity}</TableCell>
                  <TableCell align="right">{li.total}</TableCell>
                </TableRow>
              )
          )}

          <TableRow>
            <TableCell component="td" scope="row" colSpan={3} />
            <TableCell component="td" scope="row" align="right">
              <b>Sub Total</b>
            </TableCell>
            <TableCell component="td" scope="row" align="right">
              {order.subtotal}
            </TableCell>
          </TableRow>

          {adjustments.length > 0 && (
            <TableRow>
              <TableCell component="td" scope="row">
                <b>Adjustments</b>
              </TableCell>
            </TableRow>
          )}
          {adjustments.map((li, idx) => (
            <TableRow key={`orderli${idx}`}>
              <TableCell component="td" scope="row" colSpan={3}>
                {`(${li.kind}) `} {li.description}
              </TableCell>
              <TableCell align="right">{li.quantity}</TableCell>
              <TableCell align="right">{li.total}</TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell component="td" scope="row" colSpan={3} />
            <TableCell component="td" scope="row" align="right">
              <b>Order Total</b>
            </TableCell>
            <TableCell component="td" scope="row" align="right">
              {order.total}
            </TableCell>
          </TableRow>

          {payments.length > 0 && (
            <TableRow>
              <TableCell component="td" scope="row">
                <b>Payments</b>
              </TableCell>
            </TableRow>
          )}
          {payments.map((li, idx) => (
            <TableRow key={`orderli${idx}`}>
              <TableCell component="td" scope="row" colSpan={3}>
                {li.description}
              </TableCell>
              <TableCell align="right">{li.quantity}</TableCell>
              <TableCell align="right">{li.total}</TableCell>
            </TableRow>
          ))}

          {credits.length > 0 && (
            <TableRow>
              <TableCell component="td" scope="row">
                <b>Credits</b>
              </TableCell>
            </TableRow>
          )}
          {credits.map((li, idx) => (
            <TableRow key={`orderli${idx}`}>
              <TableCell component="td" scope="row" colSpan={3}>
                {li.description}
              </TableCell>
              <TableCell align="right">{li.quantity}</TableCell>
              <TableCell align="right">{li.total}</TableCell>
            </TableRow>
          ))}

          {balance > 0 && (
            <>
              <TableRow>
                <TableCell component="td" scope="row" colSpan={3} />
                <TableCell component="td" scope="row" align="right">
                  <b>Balance Due</b>
                </TableCell>
                <TableCell component="td" scope="row" align="right">
                  {balance.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} align="right">
                  <PaymentDialog
                    amount={balance}
                    description={`#${order.id}`}
                    order={order}
                    setRefetchOrders={props.setRefetchOrders}
                  />
                </TableCell>
              </TableRow>
            </>
          )}

          {balance < 0 && (
            <TableRow>
              <TableCell component="td" scope="row" colSpan={3} />
              <TableCell component="td" scope="row" align="right">
                <b>Credit Owed</b>
              </TableCell>
              <TableCell component="td" scope="row" align="right">
                {Math.abs(balance).toFixed(2)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Grid item xs={6}>
          <div className={classes.gridItem}>
            <Typography
              variant="overline"
              display="block"
              className={classes.gridHeading}
              gutterBottom
            >
              Info
            </Typography>
            <Typography variant="body1">
              {order.name} {order.email}
              <br />
              {order.phone}
              <br />
              {order.address} <br />
            </Typography>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={classes.gridItem}>
            <Typography
              variant="overline"
              display="block"
              className={classes.gridHeading}
              gutterBottom
            >
              notes
            </Typography>
            <Typography variant="body2">{order.notes}</Typography>
          </div>
        </Grid>
      </Grid>

      <div className={classes.lastUpdated}>
        <i>Created: </i>{' '}
        {order.createdAt && new Date(order.createdAt).toLocaleString()}
        {order.createdAt !== order.updatedAt && (
          <>
            <i>, Last updated:</i>{' '}
            {order.updatedAt && new Date(order.updatedAt).toLocaleString()}
          </>
        )}
      </div>
    </div>
  )
}
