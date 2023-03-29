import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'

import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { Tooltip } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useRouter } from 'next/router'
import { PROFILE } from '@/routes/routeSpecs'
import { useLogout } from '@/routes/useLogout'
import { useUser } from '@/queries/user'
import { Avatar } from '../Avatar'
import { userToGeneric } from '@/utils/friends'
import { Alert } from '../Alert'
import { getErrorMessage } from '@/utils/api'

export default function Navbar() {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const doLogout = useLogout()
  const { data: user, error } = useUser()

  if (!user) {
    return <Alert severity={'error'} message={getErrorMessage(error)} />
  }

  const genericUser = userToGeneric(user)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static" sx={{ borderRadius: '20px 20px 0 0', zIndex: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="back"
          sx={{ mr: 2 }}
          onClick={() => router.back()}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Tooltip title="Open settings">
          <IconButton onClick={handleMenu} sx={{ p: 0 }}>
            <Avatar user={genericUser} size={'sm'} />
          </IconButton>
        </Tooltip>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => router.push(PROFILE)}>Profile</MenuItem>
          <MenuItem onClick={doLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
