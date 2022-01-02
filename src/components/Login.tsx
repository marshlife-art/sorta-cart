import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Container, Button, TextField, Link } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { RootState } from '../redux'
import { login } from '../redux/session/actions'
import { UserServiceProps } from '../redux/session/reducers'

interface OwnProps {
  onLoginFn?: () => void
  showTitle?: boolean
}

interface DispatchProps {
  login: (email: string, password?: string) => void
}

type Props = UserServiceProps & OwnProps & DispatchProps & RouteComponentProps

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    // minHeight: '100vh',
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  forgotpassword: {
    marginTop: theme.spacing(3)
  },
  passwordlogin: {
    marginTop: theme.spacing(2)
  }
}))

function Login(props: Props) {
  const [email, setEmail] = useState('')
  const [usePasswordLogin, setUsePasswordLogin] = useState(false)
  const [password, setPassword] = useState('')
  const doLogin = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (email && !usePasswordLogin) {
      props.login(email)
    } else if (usePasswordLogin && password && email) {
      props.login(email, password)
    }
  }

  const { userService, showTitle, onLoginFn, history } = props
  const classes = useStyles()
  const [error, setError] = useState('')

  // when userService changes, figure out if the page should redirect if a user is already logged in.
  useEffect(() => {
    if (userService.user && !userService.isFetching && userService.user.role) {
      onLoginFn ? onLoginFn() : history.push('/')
    }
    // else if (userService.user && !userService.isFetching) {
    //   setError('o noz! error! ...hmm??')
    // }
  }, [userService, onLoginFn, history])

  return (
    <Container maxWidth="sm">
      <form onSubmit={doLogin} className={classes.form}>
        {showTitle && (
          <div className={classes.title}>
            <Typography variant="h2" display="block">
              Sign In
            </Typography>
          </div>
        )}
        <TextField
          label="email"
          name="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          fullWidth
          required
        />
        {usePasswordLogin ? (
          <TextField
            label="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
        ) : (
          <div className={classes.passwordlogin}>
            <Link color="primary" onClick={() => setUsePasswordLogin(true)}>
              Use Password Login...
            </Link>
          </div>
        )}

        <div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={props.userService.isFetching}
            className={classes.submit}
          >
            {!usePasswordLogin ? 'Email Magic Link' : 'Login'}
          </Button>
        </div>

        <Box>
          {props.userService.message && (
            <Typography variant="body1" display="block" gutterBottom>
              {props.userService.message.message}
            </Typography>
          )}
        </Box>
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

        <Box className={classes.forgotpassword}>
          <Button
            fullWidth
            // variant="contained"
            // color="primary"
            onClick={() => props.history.push('/forgotpassword')}
          >
            <i>Forgot Password?</i>
          </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login))
