import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
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
import InputAdornment from '@material-ui/core/InputAdornment'
import Box from '@material-ui/core/Box'
import BackIcon from '@material-ui/icons/ArrowBack'
import Link from '@material-ui/core/Link'

import NavBar from './NavBar'
import {
  useCartService,
  emptyCart,
  addStoreCreditToCart,
  validateLineItems,
  setDonationAmount
} from '../services/useCartService'
import CartTable from './CartTable'
import Login from './Login'
import { Order, OrderLineItem } from '../types/Order'
import { BLANK_ORDER, API_HOST } from '../constants'
import { UserService, UserServiceProps } from '../redux/session/reducers'
import { RootState } from '../redux'
import SquarePayment from './SquarePayment'
import { fetchStoreCredit } from './MyOrders'
import { getMyMember } from '../services/orderService'

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
    history: any
    setCanGoToNextStep: React.Dispatch<React.SetStateAction<boolean>>
  } & StepButtonsProps &
    UserServiceProps
) {
  const classes = registrationStyles()
  const [opt, setOpt] = useState<'login' | 'register' | 'guest' | undefined>()

  const {
    setCanGoToNextStep,
    handleNext,
    backDisabled,
    handleBack,
    nextDisabled,
    nextText,
    userService
  } = props

  useEffect(() => {
    if (userService && userService.user && userService.user.id) {
      handleNext && handleNext()
    } else {
      setCanGoToNextStep(false)
    }
  }, [setCanGoToNextStep, userService, handleNext])

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
              <Button
                color="secondary"
                onClick={() => props.history.push('/register')}
              >
                Join the Co-op
              </Button>
            </div>
            {/* <div className={classes.optItem}>
              <Typography variant="body1" gutterBottom>
                ...or continue as a
              </Typography>
              <Button onClick={() => onCanContinue()}>Guest</Button>
            </div> */}
          </div>
        )}

        {opt === 'login' && <Login onLoginFn={onCanContinue} />}
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
    },
    donateBoxFlex: {
      marginTop: theme.spacing(4),
      display: 'flex',
      justifyContent: 'space-between'
    },
    twoPickups: {
      marginTop: theme.spacing(4)
    },
    storeCredit: {
      marginTop: theme.spacing(4)
    }
  })
)

interface ReviewCartProps {
  setCanGoToNextStep: React.Dispatch<React.SetStateAction<boolean>>
  setOrder: React.Dispatch<React.SetStateAction<Order>>
}

function ReviewCart(
  props: ReviewCartProps & StepButtonsProps & UserServiceProps
) {
  const classes = reviewStyles()
  const cartResult = useCartService()
  const {
    setCanGoToNextStep,
    backDisabled,
    handleBack,
    nextDisabled,
    nextText,
    setOrder,
    userService
  } = props

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [storeCredit, setStoreCredit] = useState(0)
  const [applyStoreCreditDisabled, setApplyStoreCreditDisabled] =
    useState(false)

  useEffect(() => {
    if (
      cartResult.status === 'loaded' &&
      cartResult.payload.line_items.length
    ) {
      const adjustments = cartResult.payload.line_items.filter(
        (li) => li.kind === 'adjustment'
      )
      if (adjustments && adjustments.length) {
        setApplyStoreCreditDisabled(true)
      } else {
        setApplyStoreCreditDisabled(false)
      }

      // validateCart and drop invalid items
      validateLineItems({ removeInvalidLineItems: true })

      // #TODO: check order for both ON HAND and backorder products
    }
  }, [cartResult])

  const getMemberInfo = useCallback(async () => {
    if (userService.user && userService.user.id) {
      const member = await getMyMember(userService.user.id)
      if (member) {
        member.name && setName(member.name)
        member.phone && setPhone(member.phone)
        member.address && setAddress(member.address)
      }
      setEmail(
        userService.user && userService.user.email ? userService.user.email : ''
      )
      setOrder((prevOrder) => ({
        ...prevOrder,
        UserId:
          userService.user && userService.user.id
            ? userService.user.id
            : undefined,
        MemberId: member && member.id ? member.id : undefined
      }))
    }
  }, [userService])

  useEffect(() => {
    userService.user && getMemberInfo()
    userService.user && fetchStoreCredit(setStoreCredit)
  }, [userService])

  useEffect(() => {
    setCanGoToNextStep && setCanGoToNextStep(!!(email && phone && name))
  }, [setCanGoToNextStep, email, phone, name])

  function handleNext() {
    const cartItems =
      cartResult.status === 'loaded' && cartResult.payload.line_items
        ? (cartResult.payload.line_items as OrderLineItem[])
        : ([] as OrderLineItem[])

    setOrder((order) => ({
      ...order,
      email,
      phone,
      name,
      address,
      notes,
      item_count: cartItems.length,
      OrderLineItems: [
        ...cartItems,
        ...order.OrderLineItems.filter((li) => li.kind !== 'product')
      ]
    }))

    props.handleNext()
  }

  function applyStoreCredit() {
    !applyStoreCreditDisabled && addStoreCreditToCart(storeCredit)
    setApplyStoreCreditDisabled(true)
  }

  return (
    <>
      <Paper className={classes.infoContainer}>
        <Grid container justify="center" direction="row" spacing={2}>
          <Grid item xs={12} md={4}>
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

            <Box className={classes.donateBoxFlex}>
              <Typography variant="overline">
                MAKE A DONATION -- Help purchase GROCERY BUNDLES for others
              </Typography>
              <TextField
                label="any amount"
                name="donation"
                type="number"
                // value={donationAmount}
                onChange={(event: any) =>
                  setDonationAmount(
                    isNaN(parseFloat(event.target.value))
                      ? 0
                      : +parseFloat(event.target.value).toFixed(2)
                  )
                }
                inputProps={{
                  min: 0
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  )
                }}
                size="small"
              />
            </Box>

            {storeCredit !== 0 && (
              <Box className={classes.storeCredit}>
                <Typography variant="overline" display="block">
                  You have ${Math.abs(storeCredit).toFixed(2)} in store credit
                </Typography>
                <Button
                  disabled={applyStoreCreditDisabled}
                  onClick={applyStoreCredit}
                  variant="contained"
                  color="secondary"
                >
                  {applyStoreCreditDisabled
                    ? 'Store credit applied'
                    : 'Apply store credit to this order'}
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            {cartResult.status !== 'loaded' && 'Loading...'}
            {cartResult.status === 'loaded' &&
              cartResult.payload.line_items.length > 0 && (
                <CartTable
                  line_items={cartResult.payload.line_items}
                  setOrder={setOrder}
                  checkout
                />
              )}
          </Grid>
        </Grid>
      </Paper>
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
    },
    freeOrPayButtonz: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    freeOrPayButton: {
      margin: theme.spacing(2),
      marginTop: theme.spacing(4)
    },
    error: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'right',
      padding: theme.spacing(2)
    }
  })
)

function Payment(
  props: {
    setCanGoToNextStep: React.Dispatch<React.SetStateAction<boolean>>
    order: Order
    userService: UserService
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

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [canPayLater, setCanPayLater] = useState(false)
  const [isFree, setIsFree] = useState(false)

  useEffect(() => {
    // if the total of the order is zero, skip CC payment.
    setIsFree(parseInt(`${order.total}`) === 0)
  }, [order.total])

  useEffect(() => {
    if (!order || !order.OrderLineItems) {
      return
    }
    // if all products in cart are on_hand then user can skip CC payment.
    setCanPayLater(
      order.OrderLineItems.filter((oli) => oli?.kind === 'product').every(
        (oli) => oli?.selected_unit === 'EA'
      ) &&
        order.OrderLineItems.filter((oli) => oli?.kind === 'product').every(
          (oli) =>
            oli?.data?.product?.count_on_hand &&
            oli?.data?.product?.count_on_hand >= oli?.quantity
        )
    )
  }, [order])

  useEffect(() => {
    setCanGoToNextStep(false)
  }, [setCanGoToNextStep])

  function handleNext(nonce: string) {
    setError('')
    setLoading(true)

    // const path =
    //   isFree || canPayLater ? '/store/freecheckout' : '/store/checkout'
    // const body = isFree || canPayLater ? { order } : { order, nonce }

    fetch(`${API_HOST}/store/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ order, nonce })
    })
      .then((r) => r.json())
      .then((response) => {
        if (response.error) {
          console.warn('/store/checkout ERROR response:', response)
          setError(response.msg || 'onoz! could not submit your order ;(')
        } else {
          emptyCart()
          props.handleNext()
        }
      })
      .catch((err) => {
        console.warn('onoz! caught error /store/checkout err:', err)
        setError('onoz! could not submit your order ;(')
      })
      .finally(() => setLoading(false))
  }

  return (
    <>
      <Paper>
        <Grid container justify="center" direction="row">
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
            <div className={classes.paymentContainer}>
              {isFree || canPayLater ? (
                isFree ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => handleNext('')}
                      disabled={!order || order.OrderLineItems.length === 0}
                    >
                      Complete Order
                    </Button>
                  </>
                ) : (
                  <div className={classes.freeOrPayButtonz}>
                    <Typography variant="body1" display="block" gutterBottom>
                      Pay now or at pick-up
                    </Typography>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => setCanPayLater(false)}
                        disabled={!order || order.OrderLineItems.length === 0}
                        className={classes.freeOrPayButton}
                      >
                        Make a Payment
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => handleNext('')}
                        disabled={!order || order.OrderLineItems.length === 0}
                        className={classes.freeOrPayButton}
                      >
                        Complete Order and Pay Later
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <SquarePayment
                  handleNext={handleNext}
                  loading={loading}
                  amount={order.total * 100}
                />
              )}
            </div>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Box color="error.main" className={classes.error}>
                <Typography variant="overline" display="block">
                  onoz! an error!
                </Typography>
                <Typography variant="body1" display="block" gutterBottom>
                  {error}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
      <StepButtons
        {...{ backDisabled, handleBack, nextDisabled, nextText }}
        handleNext={props.handleNext}
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

      {nextText !== 'Finish' && (
        <Button
          disabled={nextDisabled}
          variant="contained"
          color="primary"
          onClick={handleNext}
          className={classes.button}
        >
          {nextText}
        </Button>
      )}
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
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
)

function getSteps() {
  return ['Member Registration', 'Review Order', 'Payment']
}

function Checkout(props: UserServiceProps & RouteComponentProps) {
  const classes = checkoutStyles()
  const { userService, history } = props

  const [activeStep, setActiveStep] = useState(0)
  const [canGoToNextStep, setCanGoToNextStep] = useState(false)
  const [order, setOrder] = useState<Order>(BLANK_ORDER)

  const steps = getSteps()

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
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
              <Typography className={classes.instructions} display="block">
                THANK YOU!
              </Typography>
              <Typography className={classes.instructions} display="block">
                A receipt has been emailed to you.
              </Typography>
              <Typography className={classes.instructions} display="block">
                See the{' '}
                <Link
                  color="secondary"
                  href="https://marshlife-art.org/marsh-food-cooperative-schedule/"
                >
                  MARSH Food Cooperative Ordering and Pick-up Schedule
                </Link>{' '}
                for more information.
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
                  userService={userService}
                  history={history}
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
                  userService={userService}
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
                  userService={userService}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (states: RootState): UserServiceProps => {
  return {
    userService: states.session.userService
  }
}

export default connect(mapStateToProps)(withRouter(Checkout))
