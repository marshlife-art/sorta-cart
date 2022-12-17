import React, { useEffect, useState } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import { API_HOST } from '../../constants'
import Button from '@material-ui/core/Button'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Fade from '@material-ui/core/Fade'
import Grid from '@material-ui/core/Grid'
import NavBar from './NavBar'
// import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Zoom from '@material-ui/core/Zoom'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridRoot: {
      width: '100%',
      overflowX: 'auto',
      minHeight: 'calc(100vh - 64px)',
      padding: theme.spacing(2),
      display: 'flex',
      marginTop: 0
    },
    flexFill: {
      flexGrow: 1
    },
    crumbz: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexGrow: 1,
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    },
    gridBtn: {
      width: '100%',
      height: '100%',
      background: theme.palette.background.paper,
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer'
      }
    },
    catHover: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer'
      }
    },
    catBtn: {
      overflow: 'hidden',
      overflowWrap: 'break-word',
      hyphens: 'auto'
    }
  })
)

export default function Landing() {
  const classes = useStyles()
  const navigate = useNavigate()

  const [categories, setCategories] = useState<string[]>([])
  const [selectedCat, setSelectedCat] = useState('')
  const [subCategories, setSubCategories] = useState<
    { name: string; label: string }[]
  >([])

  useEffect(() => {
    fetch(`${API_HOST}/categories`)
      .then((response) => response.json())
      .then((result) => {
        const catz = Object.keys(result).filter((cat) => {
          const tcat = cat.trim()
          return !!tcat && tcat !== 'null'
        })
        setCategories(catz)
      })
      .catch((err) => {
        console.warn('onoz, caught err:', err)
        setCategories([])
      })
  }, [setCategories])

  useEffect(() => {
    fetch(`${API_HOST}/sub_categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ categories: [selectedCat] })
    })
      .then((response) => response.json())
      .then((result) => {
        setSubCategories(
          Object.keys(result)
            .filter((subcat) => {
              const tsubcat = subcat.trim()
              return !!tsubcat && tsubcat !== 'null'
            })
            .map((name) => ({
              name,
              label: name
                .split(':')
                .join(': ')
                .split(',')
                .join(', ')
                .split('/')
                .join(' / ')
                .split('-')
                .join(' - ')
            }))
        )
      })
      .catch((err) => {
        console.warn('onoz, caught err:', err)
        setSubCategories([])
      })
  }, [selectedCat])

  return (
    <>
      <NavBar onBrandBtnClick={() => setSelectedCat('')} showCart>
        <div className={classes.flexFill}></div>
        {selectedCat && (
          <div className={classes.crumbz}>
            <Fade in>
              <ChevronRightIcon fontSize="large" />
            </Fade>
            <Fade in style={{ transitionDelay: '50ms' }}>
              <Button
                variant="text"
                size="large"
                onClick={() => setSelectedCat('')}
              >
                <Typography
                  variant="h6"
                  className={selectedCat && classes.catHover}
                >
                  CATEGORIES
                </Typography>
              </Button>
            </Fade>

            <Fade in style={{ transitionDelay: '100ms' }}>
              <ChevronRightIcon fontSize="large" />
            </Fade>
            <Fade in style={{ transitionDelay: '150ms' }}>
              <Typography variant="h6">{selectedCat.toUpperCase()}</Typography>
            </Fade>
          </div>
        )}
      </NavBar>
      {/* <Paper className={classes.root}> */}
      <Grid container spacing={4} justify="center" className={classes.gridRoot}>
        {categories &&
          !selectedCat &&
          categories.map((i, idx) => (
            <Zoom
              in
              style={{ transitionDelay: `${idx * 50}ms` }}
              key={`lb${idx}`}
            >
              <Grid item xs={12} sm={4} md={3} lg={2}>
                <Button
                  className={classes.gridBtn}
                  variant="outlined"
                  size="large"
                  key={`lb${idx}`}
                  onClick={() => setSelectedCat(i)}
                >
                  <Typography variant="h5" className={classes.catBtn}>
                    {i}
                  </Typography>
                </Button>
              </Grid>
            </Zoom>
          ))}

        {categories.length > 0 && !selectedCat && (
          <>
            <Zoom
              in
              style={{
                transitionDelay: `${categories.length * 50}ms`
              }}
            >
              <Grid item xs={12} sm={4} md={3} lg={3}>
                <Button
                  className={classes.gridBtn}
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/products/onhand/marsh')}
                >
                  <Typography variant="h5" className={classes.catBtn}>
                    MARSH ON HAND
                  </Typography>
                </Button>
              </Grid>
            </Zoom>

            <Zoom
              in
              style={{
                transitionDelay: `${categories.length * 50}ms`
              }}
            >
              <Grid item xs={12} sm={4} md={3} lg={3}>
                <Button
                  className={classes.gridBtn}
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/products')}
                >
                  <Typography variant="h5" className={classes.catBtn}>
                    See Everything
                  </Typography>
                </Button>
              </Grid>
            </Zoom>
          </>
        )}

        {subCategories &&
          selectedCat &&
          subCategories.map((subCat, idx) => (
            <Zoom
              in
              style={{ transitionDelay: `${idx * 50}ms` }}
              key={`lb${idx}`}
            >
              <Grid item xs={12} sm={4} md={3}>
                <Button
                  className={classes.gridBtn}
                  variant="outlined"
                  size="large"
                  key={`lb${idx}`}
                  onClick={() =>
                    navigate(
                      `/products/${encodeURIComponent(
                        selectedCat
                      )}/${encodeURIComponent(subCat.name)}`
                    )
                  }
                >
                  <Typography variant="h5" className={classes.catBtn}>
                    {subCat.label}
                  </Typography>
                </Button>
              </Grid>
            </Zoom>
          ))}

        {subCategories.length > 0 && selectedCat && (
          <Zoom
            in
            style={{
              transitionDelay: `${subCategories.length * 50}ms`
            }}
          >
            <Grid item xs={12} sm={4} md={3}>
              <Button
                className={classes.gridBtn}
                variant="outlined"
                size="large"
                onClick={() =>
                  navigate(`/products/${encodeURIComponent(selectedCat)}`)
                }
              >
                <Typography variant="h5" className={classes.catBtn}>
                  See Everything
                </Typography>
              </Button>
            </Grid>
          </Zoom>
        )}
      </Grid>
      {/* </Paper> */}
    </>
  )
}
