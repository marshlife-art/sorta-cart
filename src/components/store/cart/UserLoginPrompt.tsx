import React, { useState } from 'react'
import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Button,
  IconButton,
  Tooltip
} from '@material-ui/core'

import Icon from '@mui/material/Icon'

import Login from '../../Login'
import { useNavigate } from 'react-router-dom'

const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '350px',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        padding: theme.spacing(1)
      }
    },
    optItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing(2),
      width: '100%'
    },
    spacer: {
      height: '50px',
      lineHeight: '50px',
      width: '100%'
    }
  })
)

export default function UserLoginPrompt() {
  const navigate = useNavigate()
  const classes = styles()
  const [doLogin, setDoLogin] = useState(false)

  return (
    <div className={classes.root}>
      {doLogin && (
        <Tooltip aria-label="back" title="back">
          <IconButton onClick={() => setDoLogin(false)}>
            <Icon>back</Icon>
          </IconButton>
        </Tooltip>
      )}
      {!doLogin && (
        <>
          <div className={classes.optItem}>
            <Typography variant="body1">Already a member?</Typography>
          </div>
          <div className={classes.optItem}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setDoLogin(true)}
            >
              Sign In
            </Button>
          </div>
          <div className={classes.spacer}>&nbsp;</div>
          <div className={classes.optItem}>
            <Typography variant="body1">Want to become a member?</Typography>
          </div>
          <div className={classes.optItem}>
            <Button
              color="secondary"
              onClick={() => {
                navigate('/register')
              }}
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
        </>
      )}

      {doLogin && <Login />}
    </div>
  )
}
