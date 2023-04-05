import { ListItem, Typography } from '@mui/material'
import { styledListItem } from '../MatchCard/MatchCard.styles'
import { GenericUser } from '../../types/GenericUser'
import { Avatar } from '../Avatar'

export const FriendCard = ({ friend }: { friend: GenericUser }) => {
  return (
    <>
      <ListItem sx={{ ...styledListItem }}>
        <Avatar user={friend} size={'sm'} />
        <Typography
          variant="h6"
          component="h3"
          margin="5px 0 2px 14px"
          fontWeight="700"
          color="primary.darker"
        >
          {friend.fullName}
        </Typography>
      </ListItem>
    </>
  )
}
