import { useMemo } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { Motion } from '../../components/Motion'
import { useFriendshipRequests } from '../../queries/friends'
import { FriendshipRequestCard } from '../../components/FriendsRequests/FriendshipRequestCard'
import { Title } from '../../components/Title'

export const FriendsRequests = () => {
  const navigate = useNavigate()
  const { data: friendsRequests } = useFriendshipRequests()

  const friendshipRequestsCards = useMemo(
    () =>
      friendsRequests?.map((friendshipRequest) => (
        <FriendshipRequestCard friendshipRequest={friendshipRequest} />
      )),
    [friendsRequests]
  )

  return (
    <Motion
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <Box
        display="flex"
        justifyContent="start"
        alignItems="center"
        gap="16px"
        marginBottom="12px"
      >
        <Button
          aria-label="Close"
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ minWidth: '20px', padding: '8px 8px' }}
        >
          <ArrowBackIosNewIcon />
        </Button>
        <Title title="Friends requests" />
      </Box>
      {friendsRequests?.length ? (
        friendshipRequestsCards
      ) : (
        <Typography
          variant="body1"
          component="p"
          align="center"
          marginTop="1.6rem"
        >
          You don't have friendship requests.
        </Typography>
      )}
    </Motion>
  )
}
