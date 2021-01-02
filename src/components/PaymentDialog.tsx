import React from 'react'
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
  makeStyles
} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import PaymentIcon from '@material-ui/icons/AttachMoney'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import { Order } from '../types/Order'
import { API_HOST } from '../constants'
import SquarePayment from './SquarePayment'
import Loading from './Loading'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2)
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  })

interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string
  children: React.ReactNode
  onClose: () => void
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'right',
      padding: theme.spacing(2)
    }
  })
)

interface PaymentDialogProps {
  amount: number
  description: string
  order: Order
  setRefetchOrders: React.Dispatch<React.SetStateAction<number>>
}

function PaymentDialog(props: PaymentDialogProps) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [complete, setComplete] = React.useState(false)
  const [error, setError] = React.useState('')
  const { order, description, setRefetchOrders } = props
  const amount = Math.floor(props.amount * 100)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  function handleNext(nonce: string) {
    setLoading(true)
    setError('')
    fetch(`${API_HOST}/store/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ order, amount, description, nonce })
    })
      .then((r) => r.json())
      .then((response) => {
        if (response.error) {
          console.warn('/store/payment ERROR response:', response)
          setError(response.msg || 'onoz! could not submit your payment ;(')
        } else {
          setComplete(true)
          setRefetchOrders((prev) => prev + 1)
          handleClose()
        }
      })
      .catch((err) => {
        console.warn('onoz! caught error /store/checkout err:', err)
        setError('onoz! could not submit your order ;(')
        setComplete(false)
      })
      .finally(() => setLoading(false))
  }

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<PaymentIcon />}
        onClick={handleClickOpen}
      >
        Make Payment
      </Button>

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Payment for Order {description}
        </DialogTitle>
        <DialogContent dividers>
          {loading && <Loading />}
          {!loading && !complete && !error && (
            <SquarePayment
              handleNext={handleNext}
              amount={amount}
              loading={loading}
            />
          )}
          {error && (
            <Box color="error.main" className={classes.error}>
              <Typography variant="overline" display="block">
                onoz! an error!
              </Typography>
              <Typography variant="body1" display="block" gutterBottom>
                {error}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PaymentDialog
