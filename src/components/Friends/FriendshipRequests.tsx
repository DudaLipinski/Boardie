import { AvatarGroup, Box, Typography, IconButton } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar } from '../Avatar'
import { FRIENDSHIP_REQUESTS } from '../../routes/routeSpecs'
import { FriendshipRequest } from '../../types/Friend'

export const styledListItem = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  bgcolor: 'background.paper',
  boxShadow: '2px 2px 13px 0px rgb(0 0 0 / 4%)',
  borderRadius: '4px',
  padding: '8px 15px',
  width: 'inherit',
  margin: '0 auto 16px',
}

export const FriendshipRequests = ({
  friendshipRequest,
}: {
  friendshipRequest: FriendshipRequest[]
}) => {
  const navigate = useNavigate()

  const avatars = friendshipRequest.map((friendship: any) => (
    <Avatar
      key={friendship.userId}
      user={{ ...friendship, type: 'USER', id: friendship.userId }}
      size={'sm'}
    ></Avatar>
  ))

  return (
    <Link to={FRIENDSHIP_REQUESTS} style={{ textDecoration: 'none' }}>
      <Box sx={{ ...styledListItem }}>
        <AvatarGroup max={2}>{avatars}</AvatarGroup>
        <Typography
          variant="body1"
          component="h3"
          color="var(--adm-color-neutral-800)"
        >
          Friendship requests
        </Typography>
        <IconButton
          aria-label="See friendship requests"
          size="small"
          onClick={() => navigate(FRIENDSHIP_REQUESTS)}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Link>
  )
}
