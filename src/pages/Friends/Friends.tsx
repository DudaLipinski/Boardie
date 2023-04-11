import { Box, Button, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { Motion } from '../../components/Motion'
import { useFriends, useFriendshipRequests } from '../../queries/friends'
import { FriendCard } from '../../components/Friends/FriendCard'
import { SendFriendRequestModal } from '../../components/Friends/SendFriendRequestModal'

import { FriendshipRequests } from '../../components/Friends/FriendshipRequests'
import { AnonFriendCard } from '../../components/Friends/AnonFriendCard'
import { Title } from '../../components/Title'

export const Friends = () => {
  const [open, setOpen] = useState(false)
  const { data: friends } = useFriends()
  const { data: friendsRequests } = useFriendshipRequests()

  const anonFriends = useMemo(
    () => friends?.filter((friend) => friend.type === 'ANON_FRIEND'),
    [friends]
  )
  const userFriends = useMemo(
    () => friends?.filter((friend) => friend.type === 'USER'),
    [friends]
  )

  const userFriendsCards = useMemo(
    () =>
      userFriends?.map((friend) => (
        <FriendCard key={friend.id} friend={friend} />
      )),
    [userFriends]
  )

  const anonFriendsCards = useMemo(
    () =>
      anonFriends?.map((friend) => (
        <AnonFriendCard key={friend.id} friend={friend} />
      )),
    [anonFriends]
  )

  return (
    <Motion
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <Box>
        <Title title="Friends" />
        {friendsRequests?.length ? (
          <FriendshipRequests friendshipRequest={friendsRequests} />
        ) : null}
        <Box
          sx={
            friendsRequests?.length
              ? { margin: '20px 0', float: 'right' }
              : { margin: '0 0 20px 0', float: 'right' }
          }
        >
          <Button
            variant="contained"
            size="small"
            type="button"
            onClick={() => setOpen(true)}
          >
            Add new +
          </Button>
        </Box>
      </Box>
      <SendFriendRequestModal setOpen={setOpen} open={open} />
      {userFriendsCards?.length ? (
        <Box component="ul" sx={{ padding: 0, margin: 0 }}>
          {userFriendsCards}
        </Box>
      ) : null}
      {anonFriendsCards?.length ? (
        <Box component="ul" sx={{ padding: 0, margin: 0 }}>
          <Typography
            variant="h3"
            component="h3"
            margin="20px 0"
            fontWeight="600"
          >
            Anonymous friends
          </Typography>
          {anonFriendsCards}
        </Box>
      ) : null}
    </Motion>
  )
}
