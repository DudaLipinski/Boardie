import { Typography } from '@mui/material'
import { Motion } from '../../components/Motion'
import { useFriends } from '../../queries/friends'
import { FriendCard } from '../../components/FriendCard/FriendCard'

export const Friends = () => {
  const { data: friends } = useFriends()

  const listItems = friends?.map((friend) => <FriendCard friend={friend} />)

  return (
    <Motion
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <Typography variant="body2" component="p" margin="20px 0">
        Friends
      </Typography>
      {listItems}
    </Motion>
  )
}
