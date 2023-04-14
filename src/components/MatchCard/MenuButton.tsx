import { MoreVert as MoreVertIcon } from '@mui/icons-material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EDIT_MATCH } from '../../routes/routeSpecs'
import { DeleteDialog } from '../DeleteDialog'

interface Props {
  id: number
  handleDeleteMatch: () => void
  isLoading: boolean
}

export const MenuButton = ({ id, handleDeleteMatch, isLoading }: Props) => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
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
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        sx={{
          boxShadow: 'var(--box-shadow)',
        }}
      >
        <MenuItem
          onClick={() => navigate(EDIT_MATCH.replace(':id', id.toString()))}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={() => setIsDeleteDialogOpen(true)}>Delete</MenuItem>
      </Menu>
      <DeleteDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDelete={handleDeleteMatch}
        title="Delete this match?"
        isLoading={isLoading}
      />
    </>
  )
}
