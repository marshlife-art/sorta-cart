import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Container, Button, TextField, Link } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { RootState } from '../redux'
import { login } from '../redux/session/actions'
import { UserService } from '../redux/session/reducers'

interface Props {
  onLoginFn?: () => void
  showTitle?: boolean
}

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

export default function Login(props: Props) {
  const { showTitle, onLoginFn } = props

  const navigate = useNavigate()
  const userService = useSelector<RootState, UserService>(
    (state) => state.session.userService
  )
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [usePasswordLogin, setUsePasswordLogin] = useState(false)
  const [password, setPassword] = useState('')
  const doLogin = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    if (email && !usePasswordLogin) {
      dispatch(login(email))
    } else if (usePasswordLogin && password && email) {
      dispatch(login(email, password))
    }
  }

  const classes = useStyles()
  const [error, setError] = useState('')

  // when userService changes, figure out if the page should redirect if a user is already logged in.
  useEffect(() => {
    if (userService.user && !userService.isFetching && userService.user.role) {
      onLoginFn ? onLoginFn() : navigate('/')
    }
    // else if (userService.user && !userService.isFetching) {
    //   setError('o noz! error! ...hmm??')
    // }
  }, [userService, onLoginFn])

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
            disabled={userService.isFetching}
            className={classes.submit}
          >
            {!usePasswordLogin ? 'Email Magic Link' : 'Login'}
          </Button>
        </div>

        <Box>
          {userService.message && (
            <Typography variant="body1" display="block" gutterBottom>
              {userService.message.message}
            </Typography>
          )}
        </Box>
        <Box color="error.main">
          {userService.error && (
            <>
              <Typography variant="overline" display="block">
                onoz! an error!
              </Typography>
              <Typography variant="body1" display="block" gutterBottom>
                {userService.error.reason}
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
            onClick={() => navigate('/forgotpassword')}
          >
            <i>Forgot Password?</i>
          </Button>
        </Box>
      </form>
    </Container>
  )
}
