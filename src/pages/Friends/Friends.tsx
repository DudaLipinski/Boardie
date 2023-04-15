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
  const [openFriendRequestModal, setOpenFriendRequestModal] = useState(false)
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
    <Motion style={{ width: '100%' }}>
      <Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          padding="20px 0 30px"
        >
          <Title title="Friends" sx={{ margin: 0 }} />
          <Button
            variant="contained"
            size="medium"
            type="button"
            onClick={() => setOpenFriendRequestModal(true)}
          >
            Add new +
          </Button>
        </Box>

        {friendsRequests?.length ? (
          <FriendshipRequests friendshipRequest={friendsRequests} />
        ) : null}

        <SendFriendRequestModal
          setOpen={setOpenFriendRequestModal}
          open={openFriendRequestModal}
        />

        {userFriendsCards?.length ? (
          <Box component="ul" sx={{ padding: 0, margin: 0 }}>
            {userFriendsCards}
          </Box>
        ) : null}

        {anonFriendsCards?.length ? (
          <Box component="ul" sx={{ padding: '8px 0 40px 0', margin: 0 }}>
            <Typography
              variant="h3"
              component="h2"
              margin="20px 0"
              fontWeight="600"
            >
              Anonymous friends
            </Typography>
            {anonFriendsCards}
          </Box>
        ) : null}
      </Box>
    </Motion>
  )
}
