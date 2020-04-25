import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { withRouter, RouteComponentProps, useLocation } from 'react-router-dom'
import { Container, Button, TextField } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { RootState } from '../redux'
import { resetPassword } from '../redux/session/actions'
import { UserServiceProps } from '../redux/session/reducers'

interface OwnProps {}

interface DispatchProps {
  resetPassword: (regKey: string, password: string) => void
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
  }
}))

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function ResetPassword(props: Props) {
  const { userService, history } = props
  const classes = useStyles()
  const [error, setError] = useState('')

  let query = useQuery()
  const regKey = query.get('regKey')
  console.log('[Register] regKey', regKey)

  const doResetPassword = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    const target = event.currentTarget as HTMLFormElement
    const passwordEl = target.elements.namedItem('password') as HTMLInputElement
    const passwordConfirmEl = target.elements.namedItem(
      'password_confirm'
    ) as HTMLInputElement

    if (
      passwordEl &&
      passwordEl.value.length > 0 &&
      passwordConfirmEl &&
      passwordConfirmEl.value.length > 0 &&
      passwordEl.value === passwordConfirmEl.value &&
      regKey
    ) {
      props.resetPassword(regKey, passwordEl.value)
    } else {
      setError('Please make sure password match!')
    }
  }

  // when userService changes, figure out if the page should redirect if a user is already logged in.
  useEffect(() => {
    if (userService.user && !userService.isFetching && userService.user.role) {
      console.log('we gotta user!', userService.user)
      history.push('/')
    }
    // else if (userService.user && !userService.isFetching) {
    //   setError('o noz! error! ...hmm??')
    // }
  }, [userService, history])

  return (
    <Container maxWidth="sm">
      <form onSubmit={doResetPassword} className={classes.form}>
        <div className={classes.title}>
          <Typography variant="h2" display="block">
            Reset Password
          </Typography>
        </div>
        <TextField
          label="password"
          name="password"
          type="password"
          fullWidth
          required
        />
        <TextField
          label="confirm password"
          name="password_confirm"
          type="password"
          fullWidth
          required
        />
        <div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={props.userService.isFetching}
            className={classes.submit}
          >
            Reset Password
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
    resetPassword: (regKey, password) =>
      dispatch(resetPassword(regKey, password))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ResetPassword))
