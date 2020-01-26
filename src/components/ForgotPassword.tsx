import React, { useState } from 'react'
import { Container, Button, TextField } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { API_HOST } from '../constants'

const useStyles = makeStyles(theme => ({
  root: {
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
  }
}))

function ForgotPassword() {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [email, setEmail] = useState('')

  function requestForgotPassword() {
    setError('')
    setSuccess('')
    setLoading(true)
    if (email && email.length > 0) {
      fetch(`${API_HOST}/forgotpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
        .then(r => r.json())
        .then(response => {
          if (response.msg && response.msg === 'ok') {
            setSuccess(
              'Please check your email for link to reset your password.'
            )
          } else {
            if (response.error) {
              setError(response.error)
            } else {
              setError('Unknown email.')
            }
          }
        })
        .catch(err => setError('Unknown email.'))
        .finally(() => setLoading(false))
    } else {
      setError('...type your email')
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h2" display="block">
            Forgot Password?
          </Typography>
        </div>
        <TextField
          label="email"
          name="email"
          type="text"
          value={email}
          onChange={(event: any) => setEmail(event.target.value)}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              requestForgotPassword()
            }
          }}
          autoFocus
          fullWidth
          required
        />

        <div>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => requestForgotPassword()}
            disabled={loading}
          >
            Send reset email
          </Button>
        </div>

        {error && (
          <Box color="error.main">
            <Typography variant="overline" display="block">
              onoz! an error!
            </Typography>
            <Typography variant="body1" display="block" gutterBottom>
              {error}
            </Typography>
          </Box>
        )}
        {success && (
          <Box>
            <Typography variant="overline" display="block">
              Success!
            </Typography>
            <Typography variant="body1" display="block" gutterBottom>
              {success}
            </Typography>
          </Box>
        )}
      </div>
    </Container>
  )
}

export default ForgotPassword
