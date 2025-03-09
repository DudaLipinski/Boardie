import { ListItem, Typography } from '@mui/material'
import { GenericUser } from '@src/types/GenericUser'
import { Avatar } from '@components/Avatar'
import { styledCard } from '@src/styles/card'

export const FriendCard = ({ friend }: { friend: GenericUser }) => {
  return (
    <>
      <ListItem sx={{ ...styledCard, minHeight: '56px', alignItems: 'center' }}>
        <Avatar user={friend} size={'sm'} />
        <Typography
          variant="body1"
          component="h3"
          margin="5px 0 2px 14px"
          fontWeight="700"
        >
          {friend.fullName}
        </Typography>
      </ListItem>
    </>
  )
}
