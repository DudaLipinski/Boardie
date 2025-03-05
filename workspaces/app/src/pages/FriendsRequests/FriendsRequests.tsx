import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'
import { useFriendshipRequests } from '@src/queries/friends'

import { Motion } from '@components/Motion'
import { FriendshipRequestCard } from './FriendshipRequestCard'
import Header from '@components/Header'

const FriendsRequests = () => {
  const navigate = useNavigate()
  const { data: friendsRequests } = useFriendshipRequests()

  const friendshipRequestsCards = useMemo(
    () =>
      friendsRequests?.map((friendshipRequest) => (
        <FriendshipRequestCard
          key={friendshipRequest.userId}
          friendshipRequest={friendshipRequest}
        />
      )),
    [friendsRequests],
  )

  return (
    <Motion
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <Header title="Friends requests" onBack={() => navigate(-1)} />
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

export default FriendsRequests
