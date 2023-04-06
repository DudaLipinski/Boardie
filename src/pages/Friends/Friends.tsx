import { Box, Button, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { Motion } from '../../components/Motion'
import { useFriends, useFriendshipRequests } from '../../queries/friends'
import { FriendCard } from '../../components/Friends/FriendCard'
import { SendFriendRequestModal } from '../../components/Friends/SendFriendRequestModal'

import { FriendshipRequests } from '../../components/Friends/FriendshipRequests'

export const Friends = () => {
  const [open, setOpen] = useState(false)
  const { data: friends } = useFriends()
  const { data: friendsRequests } = useFriendshipRequests()

  const friendsCards = useMemo(
    () =>
      friends?.map((friend) => <FriendCard key={friend.id} friend={friend} />),
    [friends]
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
        <Typography
          variant="h2"
          component="h2"
          margin="20px 0"
          fontWeight="600"
        >
          Friends
        </Typography>
        {friendsRequests?.length ? (
          <FriendshipRequests friendshipRequest={friendsRequests} />
        ) : null}
      </Box>
      <Box display="block" margin="20px 0">
        <Button
          variant="contained"
          size="small"
          type="button"
          sx={{ float: 'right' }}
          onClick={() => setOpen(true)}
        >
          Add new +
        </Button>
      </Box>
      <SendFriendRequestModal setOpen={setOpen} open={open} />
      {friendsCards}
    </Motion>
  )
}
