import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import SquarePayment from './SquarePayment'
import { Slider } from '@material-ui/core'
import { Member } from '../types/Member'
import { User } from '../types/User'
import { RootState } from '../redux'
import { UserServiceProps } from '../redux/session/reducers'
import { register } from '../redux/session/actions'
import { API_HOST } from '../constants'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    // minHeight: '100vh',
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '& .MuiFormHelperText-root': {
      color: theme.palette.error.main,
      textAlign: 'right'
    }
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: theme.spacing(2)
  },
  notice: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1)
  },
  formControl: {
    margin: `${theme.spacing(2)}px 0`,
    '& legend': {
      fontSize: '1.25rem',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1)
    }
  },
  slider: {
    margin: theme.spacing(4),
    marginRight: '50px',
    maxWidth: '83vw'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  paymentContainer: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '33vh'
  },
  natValid: {
    marginTop: theme.spacing(5)
  },
  continueWrapper: {
    marginTop: theme.spacing(4),
    textAlign: 'center'
  }
}))

interface OwnProps {}

interface DispatchProps {
  register: (
    user: Partial<User>,
    member: Partial<Member>,
    nonce: string
  ) => void
}

type Props = RouteComponentProps & UserServiceProps & DispatchProps

function Register(props: Props) {
  const { history, userService } = props
  const classes = useStyles()
  // const [error, setError] = useState('')
  const [purchaseshare, setPurchaseshare] = useState('')
  const [understandBylaws, setUnderstandBylaws] = useState(false)
  const [registrationFee, setRegistrationFee] = useState(100)
  const [subsityAmount, setSubsityAmount] = useState(99)
  const [otherexpexplain, setOtherexpexplain] = useState(false)
  const [userData, setUserData] = useState<Partial<User>>({})
  const [member, setMember] = useState<Partial<Member>>({})
  const [memberData, setMemberData] = useState<object>({})

  const [valid, setValid] = useState(false)
  const [validEmail, setValidEmail] = useState<boolean | undefined>(undefined)
  const [complete, setComplete] = useState(false)

  const doRegister = (nonce: string) => {
    // console.log(
    //   'doRegister understandBylaws:',
    //   understandBylaws,
    //   ' userData:',
    //   userData,
    //   ' menber:',
    //   member,
    //   ' memberData:',
    //   memberData,
    //   ' nonce:',
    //   nonce
    // )

    props.register(
      userData,
      { ...member, data: memberData, fees_paid: registrationFee },
      nonce
    )
  }

  useEffect(() => {
    if (userService.user && !userService.isFetching && userService.user.role) {
      // console.log('we gotta user!', userService.user)
      setComplete(true)
    } else {
      setComplete(false)
    }
  }, [userService])

  const handlePurchaseShareChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    // console.log('handlePurchaseShareChange value:', value)
    setRegistrationFee(100)
    setSubsityAmount(99)
    setPurchaseshare(value)
  }

  function valuetext(value: number) {
    return `$${value.toFixed(2)}`
  }

  function handleUserDataChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist()
    event &&
      event.target &&
      setUserData((data) => ({
        ...data,
        [event.target.name]: event.target.value
      }))
  }

  function handleMemberChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.persist()
    event &&
      event.target &&
      setMember((member) => ({
        ...member,
        [event.target.name]: event.target.value
      }))
  }

  function checkValidEmail(event: any) {
    // console.log('checkValidEmail!! userData.email:', userData.email)
    if (userData.email && userData.email.length) {
      // console.log('checkValidEmail checking email..')
      fetch(`${API_HOST}/register/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email
        })
      })
        .then((r) => r.json())
        .then((response) => {
          // console.log('/register/check response:', response)
          setValidEmail(!!response && response.valid)
        })
        .catch((err) => console.warn('onoz! register/check err:', err))
    } else {
      setValidEmail(undefined)
    }
  }

  useEffect(() => {
    setValid(
      !!(
        purchaseshare &&
        understandBylaws &&
        userData.email &&
        userData.password &&
        member.name &&
        member.phone
      )
    )
  }, [purchaseshare, understandBylaws, userData, member])

  return (
    <Container maxWidth="sm">
      {!complete ? (
        <form className={classes.form}>
          <div className={classes.title}>
            <Typography variant="h2" display="block">
              Join the Co-op
            </Typography>
          </div>
          <TextField
            label="email"
            name="email"
            type="text"
            helperText={
              validEmail === false ? 'that email is already taken!' : 'Required'
            }
            onChange={handleUserDataChange}
            onBlur={checkValidEmail}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="password"
            name="password"
            type="password"
            helperText="Required"
            onChange={handleUserDataChange}
            fullWidth
            required
          />
          <TextField
            label="name"
            name="name"
            type="text"
            helperText="Required"
            onChange={handleMemberChange}
            fullWidth
            required
          />
          <TextField
            label="phone"
            name="phone"
            type="phone"
            helperText="Required"
            onChange={handleMemberChange}
            fullWidth
            required
          />
          <TextField
            label="address"
            name="address"
            type="text"
            onChange={handleMemberChange}
            fullWidth
          />

          <p className={classes.notice}>
            <i>
              By purchasing a share in the co-op, I understand that I am an
              equal owner in the enterprise and am eligible to vote on co-op
              matters and in board elections and to make proposals for the use
              of the kitchen and event space. I agree to pay for and pick up my
              groceries in a timely manner and to collaborate with others for
              the benefit of my co-members and the community at large. I
              understand that Member shares cost $100 and I can request a
              subsidy or contribute to subsidies for others.
            </i>
          </p>

          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Purchase Share:</FormLabel>
            <RadioGroup
              aria-label="purchaseshare"
              name="purchaseshare"
              // value={value}
              onChange={handlePurchaseShareChange}
            >
              <FormControlLabel
                value="oneshare"
                control={<Radio />}
                label="I am purchasing a share for $100."
              />
              <FormControlLabel
                value="requestsubsidy"
                control={<Radio />}
                label="I can pay some for my share and am requesting a subsidy."
              />
              {purchaseshare === 'requestsubsidy' && (
                <Slider
                  className={classes.slider}
                  getAriaValueText={valuetext}
                  value={subsityAmount}
                  onChange={(_, amt: number | number[]) => {
                    setSubsityAmount(Array.isArray(amt) ? amt[0] : amt)
                    setRegistrationFee(Array.isArray(amt) ? amt[0] : amt)
                  }}
                  step={1}
                  min={25}
                  max={99}
                  marks={[
                    {
                      value: 25,
                      label: '$25'
                    },
                    {
                      value: 99,
                      label: '$99'
                    }
                  ]}
                  valueLabelDisplay="on"
                />
              )}
              <FormControlLabel
                value="payadditional"
                control={<Radio />}
                label="I can pay $100 and would like to pay an additional amount to
              subsidize others."
              />
              {purchaseshare === 'payadditional' && (
                <Slider
                  className={classes.slider}
                  getAriaValueText={valuetext}
                  value={registrationFee}
                  onChange={(_, amt: number | number[]) =>
                    setRegistrationFee(Array.isArray(amt) ? amt[0] : amt)
                  }
                  step={1}
                  min={101}
                  max={1000}
                  marks={[
                    {
                      value: 150,
                      label: '$150'
                    },
                    {
                      value: 250,
                      label: '$250'
                    },
                    {
                      value: 350,
                      label: '$350'
                    },
                    {
                      value: 500,
                      label: '$500'
                    }
                  ]}
                  valueLabelDisplay="on"
                />
              )}
            </RadioGroup>
            <FormHelperText>Required</FormHelperText>
          </FormControl>

          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Check any that apply:</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>,
                      checked: boolean
                    ) => {
                      setMemberData((data) => ({
                        ...data,
                        workerOwner: checked
                      }))
                    }}
                    value="worker-owner"
                  />
                }
                label="I may be interested in participating in the co-op as a worker-owner."
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>,
                      checked: boolean
                    ) => {
                      setMemberData((data) => ({ ...data, producer: checked }))
                    }}
                    value="producer-owner"
                  />
                }
                label="I may be interested in participating in the co-op as a producer."
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>,
                      checked: boolean
                    ) => {
                      setMemberData((data) => ({
                        ...data,
                        kitchenExperience: checked
                      }))
                    }}
                    value="kitchenexp"
                  />
                }
                label="I have kitchen experience."
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>,
                      checked: boolean
                    ) => {
                      setMemberData((data) => ({
                        ...data,
                        farmingGardeningExperience: checked
                      }))
                    }}
                    value="farminggardeningexp"
                  />
                }
                label="I have farming/gardening experience."
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(_, checked: boolean) =>
                      setOtherexpexplain(checked)
                    }
                    value="otherexp"
                  />
                }
                label="I have other relevant experience."
              />
              {otherexpexplain && (
                <TextField
                  label="explain"
                  name="otherexpexplain"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    event.persist()
                    event &&
                      event.target &&
                      setMemberData((data) => ({
                        ...data,
                        otherexpExplain: event.target.value
                      }))
                  }}
                  type="text"
                  multiline
                  rowsMax="10"
                  fullWidth
                />
              )}
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">
              MARSH Cooperative Bylaws and principles
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    // checked={false}
                    name="understandBylaws"
                    onChange={(_, checked: boolean) =>
                      setUnderstandBylaws(checked)
                    }
                    value="agree"
                  />
                }
                label="I understand that the MARSH Cooperative Bylaws and principles are
            available online or upon request and that these documents guide the
            co-op and its members."
              />
            </FormGroup>
            <FormHelperText>Required</FormHelperText>
          </FormControl>

          <div className={classes.paymentContainer}>
            {valid && validEmail ? (
              <SquarePayment
                handleNext={doRegister}
                amount={registrationFee * 100}
                loading={userService.isFetching}
              />
            ) : (
              <Box color="error.main" className={classes.natValid}>
                <Typography variant="overline" display="block" gutterBottom>
                  {validEmail === false
                    ? 'Oh noz! That email is already registered'
                    : 'Please fill out all the required fields to complete registration.'}
                </Typography>
                <Typography variant="body1" display="block" gutterBottom>
                  Please contact us if you need help.
                </Typography>
              </Box>
            )}
          </div>

          {/* <Box color="error.main">
            {error && (
            <>
              <Typography variant="overline" display="block">
                onoz! an error!
              </Typography>
              <Typography variant="body1" display="block" gutterBottom>
                {error}
              </Typography>
            </>
          )}
          </Box> */}
        </form>
      ) : (
        <Box>
          <Typography variant="overline" display="block" gutterBottom>
            Thank you!
          </Typography>
          <Typography variant="body2" display="block" gutterBottom>
            Registration complete. Please check your email for a confirmation
            link.
          </Typography>
          <div className={classes.continueWrapper}>
            <Button
              onClick={() => history.push('/')}
              variant="outlined"
              size="large"
            >
              Continue to the store
            </Button>
          </div>
        </Box>
      )}
    </Container>
  )
}

const mapStateToProps = (states: RootState): UserServiceProps => {
  return {
    userService: states.session.userService
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    register: (user, member, nonce) => dispatch(register(user, member, nonce))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Register))

// export default withRouter(Register)
