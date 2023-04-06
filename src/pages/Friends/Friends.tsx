import { Box, Button, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { Motion } from '../../components/Motion'
import { useFriends } from '../../queries/friends'
import { FriendCard } from '../../components/FriendCard/FriendCard'
import { SendFriendRequestModal } from '../../components/SendFriendRequestModal/SendFriendRequestModal'

export const Friends = () => {
  const [open, setOpen] = useState(false)
  const { data: friends } = useFriends()

  const listItems = useMemo(
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
      <Box display="flex" justifyContent="space-between" margin="20px 0">
        <Typography variant="body2" component="p">
          Friends
        </Typography>
        <Button
          variant="outlined"
          size="small"
          type="button"
          onClick={() => setOpen(true)}
        >
          Add new +
        </Button>
      </Box>
      <SendFriendRequestModal setOpen={setOpen} open={open} />
      {listItems}
    </Motion>
  )
}
