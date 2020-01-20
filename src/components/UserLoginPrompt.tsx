import React, { useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Button,
  IconButton,
  Tooltip
} from '@material-ui/core'
import BackIcon from '@material-ui/icons/ArrowBack'

import Login from './Login'

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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(2),
      width: '100%'
    }
  })
)

function UserLoginPrompt(props: RouteComponentProps) {
  const classes = styles()
  const [doLogin, setDoLogin] = useState(false)

  return (
    <div className={classes.root}>
      {doLogin && (
        <Tooltip aria-label="back" title="back">
          <IconButton onClick={() => setDoLogin(false)}>
            <BackIcon />
          </IconButton>
        </Tooltip>
      )}
      {!doLogin && (
        <>
          <div className={classes.optItem}>
            <Typography variant="body1" gutterBottom>
              Already a member?
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setDoLogin(true)}
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
              Register
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

export default withRouter(UserLoginPrompt)
