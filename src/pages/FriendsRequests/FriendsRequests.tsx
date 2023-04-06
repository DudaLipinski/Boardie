import { Typography } from '@mui/material'
import { useMemo } from 'react'
import { Motion } from '../../components/Motion'
import { useFriendshipRequests } from '../../queries/friends'
import { FriendshipRequestCard } from '../../components/Friends/FriendshipRequestCard'
import { GenericUser } from '../../types/GenericUser'

export const FriendsRequests = () => {
  const { data: friendsRequests } = useFriendshipRequests()

  const friendshipRequestsCards = useMemo(
    () =>
      friendsRequests?.map((friendshipRequest: Omit<GenericUser, 'type'>) => (
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
      <Typography variant="h2" component="h2" margin="20px 0" fontWeight="600">
        Friends Requests
      </Typography>
      {friendshipRequestsCards}
    </Motion>
  )
}
