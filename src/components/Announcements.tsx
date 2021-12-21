import React, { useState, useRef, useEffect } from 'react'
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { useDispatch, useSelector } from 'react-redux'

import { setPreferences } from '../redux/preferences/actions'
import { API_HOST } from '../constants'
import renderers from './renderers'
import { Preferences } from '../types/Preferences'
import { RootState } from '../redux'
import {
  openAnnouncement,
  closeAnnouncement
} from '../redux/announcement/actions'

interface Announcement {
  id: number
  slug: string
  createdAt: string
  content: string
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2)
    },
    title: {
      marginRight: 48
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  })

interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string
  children: React.ReactNode
  onClose: () => void
}

const ADialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className={classes.title}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
})

export default function Announcements(props: { preferences: Preferences }) {
  const { preferences } = props
  const last_seen_announcement = preferences?.last_seen_announcement
  const open = useSelector(
    (state: RootState) => state.announcement.announcementService.open
  )
  const dispatch = useDispatch()
  const [announcement, setAnnouncement] = useState<Announcement | null>()

  const handleClose = () => {
    dispatch(closeAnnouncement())
  }

  const descriptionElementRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  useEffect(() => {
    fetch(`${API_HOST}/page/latest`)
      .then((response) => response.json())
      .then((result) => {
        setAnnouncement(result)

        // check if need to show this announcement
        if (!isNaN(parseInt(last_seen_announcement))) {
          if (result.id <= parseInt(last_seen_announcement)) {
            return
          }
        }

        if (result && result.slug && result.content) {
          dispatch(openAnnouncement())
          dispatch(
            setPreferences({
              ...preferences,
              last_seen_announcement: `${result.id}`
            })
          )
        }
      })
      .catch(console.warn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [last_seen_announcement])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <ADialogTitle id="scroll-dialog-title" onClose={handleClose}>
        {announcement && announcement.slug}
      </ADialogTitle>

      <DialogContent dividers={true}>
        <ReactMarkdown plugins={[gfm]}>
          {announcement ? announcement.content : ''}
        </ReactMarkdown>
      </DialogContent>
    </Dialog>
  )
}
