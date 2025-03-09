import { AvatarGroup, Typography, IconButton, Button } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar } from '@components/Avatar'
import { FRIENDSHIP_REQUESTS } from '@src/routes/routeSpecs'
import { FriendshipRequest } from '@src/types/Friend'

export const styledListItem = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '0 0 16px',
}

export const FriendshipRequests = ({
  friendshipRequest,
}: {
  friendshipRequest: FriendshipRequest[]
}) => {
  const navigate = useNavigate()

  const avatars = friendshipRequest.map((friendship) => (
    <Avatar
      key={friendship.userId}
      user={{ ...friendship, type: 'USER', id: friendship.userId }}
      size={'sm'}
    ></Avatar>
  ))

  return (
    <Link to={FRIENDSHIP_REQUESTS} style={{ textDecoration: 'none' }}>
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ ...styledListItem, minHeight: '56px' }}
      >
        <AvatarGroup
          max={2}
          sx={{
            '.MuiAvatar-root': {
              background: 'white',
              color: 'secondary.main',
              width: '38px',
              height: '38px',
              fontSize: '16px',
              border: '1px solid var(--color-secondary)',
            },
          }}
        >
          {avatars}
        </AvatarGroup>
        <Typography variant="body1" component="h3" fontWeight={600}>
          Friendship requests
        </Typography>
        <IconButton
          aria-label="See friendship requests"
          size="small"
          onClick={() => navigate(FRIENDSHIP_REQUESTS)}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Button>
    </Link>
  )
}
