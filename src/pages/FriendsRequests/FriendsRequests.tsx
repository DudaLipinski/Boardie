import { useMemo } from 'react'
import { Motion } from '../../components/Motion'
import { useFriendshipRequests } from '../../queries/friends'
import { FriendshipRequestCard } from '../../components/FriendsRequests/FriendshipRequestCard'
import { Title } from '../../components/Title'

export const FriendsRequests = () => {
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
      <Title title="Friends requests" />
      {friendshipRequestsCards}
    </Motion>
  )
}
