import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import CasinoIcon from '@mui/icons-material/Casino'
import PeopleIcon from '@mui/icons-material/People'
import { useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'
import { Button, ButtonGroup, IconButton } from '@mui/material'
import {
  CREATE_MATCH,
  DASHBOARD,
  FRIENDS,
  MATCHES,
  PROFILE,
} from '../../routes/routeSpecs'
import { Avatar } from '../Avatar'
import { userToGeneric } from '../../utils/friends'
import { User } from '../../types/User'

const styledIconProps = { width: '48px', height: '48px' }

export const TabBar = ({ user }: { user: User }) => {
  const navigate = useNavigate()

  const genericUser = userToGeneric(user)

  return (
    <Box
      component="nav"
      sx={{
        boxShadow: '0px -9px 24px 1px rgba(0, 0, 0, 0.25)',
        zIndex: '1',
      }}
    >
      <BottomNavigation sx={{ borderRadius: '0 0 20px 20px', zIndex: 2 }}>
        <ButtonGroup
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '4px 24px',
          }}
          variant="text"
        >
          <IconButton
            sx={{ ...styledIconProps }}
            aria-label="Dashboard"
            color="default"
            onClick={() => navigate(DASHBOARD)}
          >
            <HomeIcon />
          </IconButton>
          <IconButton
            sx={{ ...styledIconProps }}
            aria-label="Matches"
            color="default"
            onClick={() => navigate(MATCHES)}
          >
            <CasinoIcon />
          </IconButton>
          <Button
            style={{
              borderRadius: 34,
            }}
            sx={{
              borderRadius: 34,
              width: 60,
              height: 60,
              marginTop: '-22px',
            }}
            color="primary"
            variant="contained"
            aria-label="Create match"
            onClick={() => navigate(CREATE_MATCH)}
          >
            <AddIcon />
          </Button>
          <IconButton
            sx={{ ...styledIconProps }}
            aria-label="Friends"
            color="default"
            onClick={() => navigate(FRIENDS)}
          >
            <PeopleIcon />
          </IconButton>
          <IconButton
            aria-label="Profile"
            onClick={() => navigate(PROFILE)}
            sx={{ ...styledIconProps }}
          >
            <Avatar user={genericUser} size={'sm'} />
          </IconButton>
        </ButtonGroup>
      </BottomNavigation>
    </Box>
  )
}
