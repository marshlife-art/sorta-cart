import Menu, { MenuProps } from '@material-ui/core/Menu'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { Icon } from '@material-ui/core'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import { SupaWholesaleOrder as WholesaleOrder } from '../../../types/SupaTypes'
import { withStyles } from '@material-ui/core/styles'

const StyledMenu = (props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
)

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem)

interface EditWholesaleOrderMenuProps {
  wholesaleOrder: WholesaleOrder
  onSaveBtnClick: () => void
  onDeleteBtnClick: () => void
  onProductsExportToCsv: () => void
}

export default function EditMenu(props: EditWholesaleOrderMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="split button"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={props.onSaveBtnClick}
        >
          save
        </Button>
        <Button
          aria-controls="wholesaleorders-menu"
          aria-haspopup="true"
          variant="contained"
          color="primary"
          size="small"
          onClick={handleClick}
        >
          <Icon>arrow_drop_down</Icon>
        </Button>
      </ButtonGroup>

      <StyledMenu
        id="wholesaleorders-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem
          onClick={() => {
            if (window.confirm('are you sure?')) {
              props.onDeleteBtnClick()
            }
            handleClose()
          }}
          disabled={
            !props.wholesaleOrder.id ||
            props.wholesaleOrder.status === 'pending'
          }
        >
          <ListItemIcon>
            <Icon>delete</Icon>
          </ListItemIcon>
          <ListItemText primary="delete wholesale order" />
        </StyledMenuItem>

        <StyledMenuItem
          onClick={() => {
            props.onProductsExportToCsv()
            handleClose()
          }}
          disabled={!props.wholesaleOrder.id}
        >
          <ListItemIcon>
            <Icon>file_copy</Icon>
          </ListItemIcon>
          <ListItemText primary="export products to .csv" />
        </StyledMenuItem>
      </StyledMenu>
    </>
  )
}
