import React, { useState, useEffect } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import BackIcon from '@material-ui/icons/ArrowBack'

import NavBar from './NavBar'
import { useCartService } from '../services/useCartService'
import CartTable from './CartTable'
import Login from './Login'
import Register from './Register'
import { Order, OrderLineItem } from '../types/Order'
import { BLANK_ORDER } from '../constants'

const registrationStyles = makeStyles((theme: Theme) =>
  createStyles({
    opt: {
      display: 'flex',
      flexDirection: 'column',
      padding: `${theme.spacing(4)}px 0`,
      alignItems: 'center'
    },
    optItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(2),
      maxWidth: '350px',
      width: '50%',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        maxWidth: 'unset'
      }
    }
  })
)

function Registration(
  props: {
    handleNext: () => void
    setCanGoToNextStep: React.Dispatch<React.SetStateAction<boolean>>
  } & StepButtonsProps
) {
  const classes = registrationStyles()
  const [opt, setOpt] = useState<'login' | 'register' | 'guest' | undefined>()

  const {
    setCanGoToNextStep,
    handleNext,
    backDisabled,
    handleBack,
    nextDisabled,
    nextText
  } = props

  useEffect(() => {
    setCanGoToNextStep(false)
  }, [setCanGoToNextStep])

  const onCanContinue = () => {
    setCanGoToNextStep(true)
    handleNext()
  }

  return (
    <>
      <Paper>
        {opt && (
          <Tooltip aria-label="back" title="back">
            <IconButton onClick={() => setOpt(undefined)}>
              <BackIcon />
            </IconButton>
          </Tooltip>
        )}
        {!opt && (
          <div className={classes.opt}>
            <div className={classes.optItem}>
              <Typography variant="body1" gutterBottom>
                Already a member?
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpt('login')}
              >
                Sign In
              </Button>
            </div>
            <div className={classes.optItem}>
              <Typography variant="body1" gutterBottom>
                Want to become a member?
              </Typography>
              <Button color="secondary" onClick={() => setOpt('register')}>
                Register
              </Button>
            </div>
            <div className={classes.optItem}>
              <Typography variant="body1" gutterBottom>
                ...or continue as a
              </Typography>
              <Button onClick={() => onCanContinue()}>Guest</Button>
            </div>
          </div>
        )}

        {opt === 'login' && <Login onLoginFn={onCanContinue} />}
        {opt === 'register' && <Register onRegisterFn={onCanContinue} />}
      </Paper>
      <StepButtons
        {...{ backDisabled, handleBack, nextDisabled, handleNext, nextText }}
      />
    </>
  )
}

const reviewStyles = makeStyles((theme: Theme) =>
  createStyles({
    infoContainer: {
      padding: theme.spacing(2),
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& .MuiFormHelperText-root': {
        color: theme.palette.error.main,
        textAlign: 'right'
      }
    }
  })
)

function ReviewCart(
  props: {
    setCanGoToNextStep: React.Dispatch<React.SetStateAction<boolean>>
    setOrder: React.Dispatch<React.SetStateAction<Order>>
  } & StepButtonsProps
) {
  const classes = reviewStyles()
  const cartResult = useCartService()
  const {
    setCanGoToNextStep,
    backDisabled,
    handleBack,
    nextDisabled,
    nextText,
    setOrder
  } = props

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    setCanGoToNextStep && setCanGoToNextStep(!!(email && phone && name))
  }, [setCanGoToNextStep, email, phone, name])

  function handleNext() {
    const OrderLineItems =
      cartResult.status === 'loaded' && cartResult.payload.line_items
        ? (cartResult.payload.line_items as OrderLineItem[])
        : ([] as OrderLineItem[])

    setOrder(order => ({
      ...order,
      email,
      phone,
      name,
      address,
      notes,
      OrderLineItems
    }))
    props.handleNext()
  }

  return (
    <>
      <Grid container justify="center" direction="row">
        <Grid item xs={12} sm={6}>
          <Paper className={classes.infoContainer}>
            <TextField
              label="email"
              name="email"
              type="text"
              value={email}
              onChange={(event: any) => setEmail(event.target.value)}
              autoFocus
              fullWidth
              helperText="Required"
              required
            />
            <TextField
              label="name"
              name="name"
              type="text"
              value={name}
              onChange={(event: any) => setName(event.target.value)}
              fullWidth
              helperText="Required"
              required
            />
            <TextField
              label="phone"
              name="phone"
              type="phone"
              value={phone}
              onChange={(event: any) => setPhone(event.target.value)}
              fullWidth
              helperText="Required"
              required
            />
            <TextField
              label="address"
              name="address"
              type="text"
              value={address}
              onChange={(event: any) => setAddress(event.target.value)}
              fullWidth
            />
            <TextField
              label="notes"
              name="notes"
              type="text"
              value={notes}
              onChange={(event: any) => setNotes(event.target.value)}
              multiline
              rowsMax="10"
              fullWidth
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          {cartResult.status !== 'loaded' && 'Loading...'}
          {cartResult.status === 'loaded' &&
            cartResult.payload.line_items.length > 0 && (
              <CartTable line_items={cartResult.payload.line_items} checkout />
            )}
        </Grid>
      </Grid>
      <StepButtons
        {...{ backDisabled, handleBack, nextDisabled, handleNext, nextText }}
      />
    </>
  )
}

const paymentStyles = makeStyles((theme: Theme) =>
  createStyles({
    paymentContainer: {
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
)

function Payment(
  props: {
    setCanGoToNextStep: React.Dispatch<React.SetStateAction<boolean>>
    order: Order
  } & StepButtonsProps
) {
  const classes = paymentStyles()
  const cartResult = useCartService()
  const {
    setCanGoToNextStep,
    backDisabled,
    handleBack,
    nextDisabled,
    nextText,
    order
  } = props

  useEffect(() => {
    setCanGoToNextStep(cartResult && cartResult.status === 'loaded')
  }, [setCanGoToNextStep, cartResult])

  function handleNext() {
    console.log('on handleNext should submit order:', order)
    // props.handleNext()
  }

  return (
    <>
      <Grid container justify="center" direction="row">
        <Grid item xs={12} sm={6}>
          {cartResult.status !== 'loaded' && 'Loading...'}
          {cartResult.status === 'loaded' &&
            cartResult.payload.line_items.length > 0 && (
              <CartTable
                line_items={cartResult.payload.line_items}
                checkout
                summary
              />
            )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paymentContainer}>
            Square Payment stuff will go here...
          </Paper>
        </Grid>
      </Grid>
      <StepButtons
        {...{ backDisabled, handleBack, nextDisabled, handleNext, nextText }}
      />
    </>
  )
}

const stepButtonsStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(2)
    },
    button: {
      marginLeft: theme.spacing(2)
    }
  })
)

interface StepButtonsProps {
  backDisabled: boolean
  handleBack: () => void
  nextDisabled: boolean
  handleNext: () => void
  nextText: string
}

function StepButtons(props: StepButtonsProps) {
  const classes = stepButtonsStyles()

  const { backDisabled, handleBack, nextDisabled, handleNext, nextText } = props
  return (
    <div className={classes.root}>
      <Button
        disabled={backDisabled}
        onClick={handleBack}
        className={classes.button}
      >
        Back
      </Button>

      <Button
        disabled={nextDisabled}
        variant="contained"
        color="primary"
        onClick={handleNext}
        className={classes.button}
      >
        {nextText}
      </Button>
    </div>
  )
}

const checkoutStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: theme.spacing(2)
    },
    instructions: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    stepBtnz: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(2)
    },
    finished: {
      minHeight: '300px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
)

function getSteps() {
  return ['Member Registration', 'Review Order', 'Payment']
}

function Checkout() {
  const classes = checkoutStyles()

  const [activeStep, setActiveStep] = useState(0)
  const [canGoToNextStep, setCanGoToNextStep] = useState(false)
  const [order, setOrder] = useState<Order>(BLANK_ORDER)

  const steps = getSteps()

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <>
      <NavBar showCart={false} />
      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {}
            const labelProps: { optional?: React.ReactNode } = {}
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <Paper className={classes.finished}>
              <Typography className={classes.instructions}>
                THANK YOU!
              </Typography>
            </Paper>
          ) : (
            <div>
              {activeStep === 0 && (
                <Registration
                  handleNext={handleNext}
                  setCanGoToNextStep={setCanGoToNextStep}
                  backDisabled={true}
                  handleBack={handleBack}
                  nextDisabled={!canGoToNextStep || activeStep === 0}
                  nextText={activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                />
              )}
              {activeStep === 1 && (
                <ReviewCart
                  setCanGoToNextStep={setCanGoToNextStep}
                  backDisabled={true}
                  handleBack={handleBack}
                  nextDisabled={!canGoToNextStep}
                  handleNext={handleNext}
                  nextText={activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  setOrder={setOrder}
                />
              )}
              {activeStep === 2 && (
                <Payment
                  setCanGoToNextStep={setCanGoToNextStep}
                  backDisabled={false}
                  handleBack={handleBack}
                  nextDisabled={!canGoToNextStep}
                  handleNext={handleNext}
                  nextText={activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  order={order}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Checkout
