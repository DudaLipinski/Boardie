import { MoreVert as MoreVertIcon } from '@mui/icons-material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EDIT_MATCH } from '../../routes/routeSpecs'

export const MenuButton = ({ id }: { id: number }) => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        id="button"
        aria-controls={open ? 'menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ width: 'initial' }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        elevation={2}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id="menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        sx={{
          boxShadow: '2px 2px 13px 0px rgb(0 0 0 / 4%)',
          '.MuiList-root': {
            paddingTop: '0',
            paddingBottom: '0',
          },
        }}
      >
        <MenuItem
          onClick={() => navigate(EDIT_MATCH.replace(':id', id.toString()))}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </>
  )
}
