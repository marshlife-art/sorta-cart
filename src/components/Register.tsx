import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
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
import { makeStyles } from '@material-ui/core/styles'

import { RootState } from '../redux'
import { login } from '../redux/session/actions'
import { UserServiceProps } from '../redux/session/reducers'

interface OwnProps {
  onRegisterFn?: () => void
  showTitle?: boolean
}

interface DispatchProps {
  login: (email: string, password: string) => void
}

type Props = UserServiceProps & OwnProps & DispatchProps & RouteComponentProps

const useStyles = makeStyles(theme => ({
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
    alignItems: 'flex-end'
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
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

function Register(props: Props) {
  const doLogin = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    const target = event.currentTarget as HTMLFormElement
    const emailEl = target.elements.namedItem('email') as HTMLInputElement
    const passwordEl = target.elements.namedItem('password') as HTMLInputElement

    if (
      emailEl &&
      emailEl.value.length > 0 &&
      passwordEl &&
      passwordEl.value.length > 0
    ) {
      props.login(emailEl.value, passwordEl.value)
    }
  }

  const { userService, showTitle, onRegisterFn, history } = props
  const classes = useStyles()
  const [error, setError] = useState('')

  // when userService changes, figure out if the page should redirect if a user is already logged in.
  useEffect(() => {
    if (userService.user && !userService.isFetching && userService.user.role) {
      console.log('we gotta user!', userService.user)
      onRegisterFn ? onRegisterFn() : history.push('/')
    }
    // else if (userService.user && !userService.isFetching) {
    //   setError('o noz! error! ...hmm??')
    // }
  }, [userService, onRegisterFn, history])

  return (
    <Container maxWidth="sm">
      <form onSubmit={doLogin} className={classes.form}>
        {showTitle && (
          <div className={classes.title}>
            <Typography variant="h2" display="block">
              Register
            </Typography>
          </div>
        )}
        <TextField
          label="email"
          name="email"
          type="text"
          helperText="Required"
          autoFocus
          fullWidth
          required
        />
        <TextField
          label="name"
          name="name"
          type="text"
          helperText="Required"
          fullWidth
          required
        />
        <TextField
          label="phone"
          name="phone"
          type="phone"
          helperText="Required"
          fullWidth
          required
        />
        <TextField label="address" name="address" type="text" fullWidth />

        <p className={classes.notice}>
          <i>
            By purchasing a share in the co-op, I understand that I am an equal
            owner in the enterprise and am eligible to vote on co-op matters and
            in board elections and to make proposals for the use of the kitchen
            and event space. I agree to pay for and pick up my groceries in a
            timely manner and to collaborate with others for the benefit of my
            co-members and the community at large. I understand that Member
            shares cost $100 and I can request a subsidy or contribute to
            subsidies for others.
          </i>
        </p>

        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Purchase Share:</FormLabel>
          <RadioGroup
            aria-label="freq"
            name="freq"
            // value={value}
            // onChange={handleChange}
          >
            <FormControlLabel
              value="whole"
              control={<Radio />}
              label="I am purchasing a share for $100."
            />
            <FormControlLabel
              value="requestsubsidy"
              control={<Radio />}
              label="I can pay some for my share and am requesting a subsidy."
            />
            <FormControlLabel
              value="requestsubsidy"
              control={<Radio />}
              label="I can pay $100 and would like to pay an additional amount to
              subsidize others."
            />
          </RadioGroup>
          <FormHelperText>Required</FormHelperText>
        </FormControl>

        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">
            I am interested in ordering groceries:
          </FormLabel>
          <RadioGroup
            aria-label="freq"
            name="freq"
            // value="freq"
            // onChange={handleChange}
          >
            <FormControlLabel
              value="1week"
              control={<Radio />}
              label="Once a week"
            />
            <FormControlLabel
              value="2month"
              control={<Radio />}
              label="Twice a month"
            />
            <FormControlLabel
              value="1month"
              control={<Radio />}
              label="Once a month"
            />
          </RadioGroup>
          <FormHelperText>Required</FormHelperText>
        </FormControl>

        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Check your preference below:</FormLabel>
          <RadioGroup
            aria-label="freq"
            name="freq"
            // value={value}
            // onChange={handleChange}
          >
            <FormControlLabel
              value="online"
              control={<Radio />}
              label=" I have Internet access and would like to order directly from the
            grocery catalog online."
            />
            <FormControlLabel
              value="inperson"
              control={<Radio />}
              label="I would like to work with Co-op staff to develop my order in person."
            />
          </RadioGroup>
          <FormHelperText>Required</FormHelperText>
        </FormControl>

        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Check any that apply:</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  // checked={false}
                  onChange={console.log}
                  value="worker-owner"
                />
              }
              label="I may be interested in participating in the co-op as a worker-owner."
            />
            <FormControlLabel
              control={
                <Checkbox
                  // checked={false}
                  onChange={console.log}
                  value="producer-owner"
                />
              }
              label="I may be interested in participating in the co-op as a producer."
            />
            <FormControlLabel
              control={
                <Checkbox
                  // checked={false}
                  onChange={console.log}
                  value="kitchenexp"
                />
              }
              label="I have kitchen experience."
            />
            <FormControlLabel
              control={
                <Checkbox
                  // checked={false}
                  onChange={console.log}
                  value="farminggardeningexp"
                />
              }
              label="I have farming/gardening experience."
            />
            <FormControlLabel
              control={
                <Checkbox
                  // checked={false}
                  onChange={console.log}
                  value="otherexp"
                />
              }
              label="I have other relevant experience."
            />
            <TextField
              label="explain"
              name="otherexpexplain"
              type="text"
              multiline
              rowsMax="10"
              fullWidth
            />
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
                  onChange={console.log}
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

        <div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={props.userService.isFetching}
            className={classes.submit}
          >
            Register
          </Button>
        </div>

        <Box color="error.main">
          {props.userService.error && (
            <>
              <Typography variant="overline" display="block">
                onoz! an error!
              </Typography>
              <Typography variant="body1" display="block" gutterBottom>
                {props.userService.error.reason}
              </Typography>
            </>
          )}
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
        </Box>
      </form>
    </Container>
  )
}

const mapStateToProps = (
  states: RootState,
  ownProps: OwnProps
): UserServiceProps => {
  return {
    userService: states.session.userService
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    login: (email, password) => dispatch(login(email, password))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Register))
