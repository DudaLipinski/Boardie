import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import CasinoIcon from '@mui/icons-material/Casino'
import PeopleIcon from '@mui/icons-material/People'
import { useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'
import { ButtonGroup, IconButton } from '@mui/material'
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
    <Box>
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
          <IconButton
            sx={{
              ...styledIconProps,
              backgroundColor: 'primary.main',
              color: 'secondary.main',
              border: '10px solid #f8f8f8',
              width: '68px',
              height: '68px',
              marginTop: '-26px',
              ':hover': {
                backgroundColor: 'primary.darker',
              },
            }}
            aria-label="Create match"
            color="default"
            onClick={() => navigate(CREATE_MATCH)}
          >
            <AddIcon />
          </IconButton>
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
