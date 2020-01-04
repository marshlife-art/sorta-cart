import React, { useState } from 'react'
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

function Registration(props: { handleNext: () => void }) {
  const classes = registrationStyles()
  const [opt, setOpt] = useState<'login' | 'register' | 'guest' | undefined>()
  return (
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
            <Button onClick={() => props.handleNext()}>Guest</Button>
          </div>
        </div>
      )}

      {opt === 'login' && <Login onLoginFn={props.handleNext} />}
      {opt === 'register' && <Register onRegisterFn={props.handleNext} />}
    </Paper>
  )
}

const reviewStyles = makeStyles((theme: Theme) =>
  createStyles({
    infoContainer: {
      padding: theme.spacing(2),
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  })
)

function ReviewCart() {
  const classes = reviewStyles()
  const cartResult = useCartService()

  return (
    <Grid container justify="center" direction="row">
      <Grid item xs={12} sm={6}>
        <Paper className={classes.infoContainer}>
          <TextField
            label="email"
            name="email"
            type="text"
            autoFocus
            fullWidth
            required
          />
          <TextField label="name" name="name" type="text" fullWidth required />
          <TextField
            label="phone"
            name="phone"
            type="phone"
            fullWidth
            required
          />
          <TextField label="address" name="address" type="text" fullWidth />
          <TextField
            label="notes"
            name="notes"
            type="text"
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

function Payment() {
  const classes = paymentStyles()
  const cartResult = useCartService()

  return (
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
  )
}

const checkoutStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: theme.spacing(2)
    },
    button: {
      marginLeft: theme.spacing(2)
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

  const [activeStep, setActiveStep] = React.useState(0)
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
              {activeStep === 0 && <Registration handleNext={handleNext} />}
              {activeStep === 1 && <ReviewCart />}
              {activeStep === 2 && <Payment />}

              <div className={classes.stepBtnz}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}
                >
                  Back
                </Button>

                <Button
                  disabled={activeStep === 0}
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Checkout
