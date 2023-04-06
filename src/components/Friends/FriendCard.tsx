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
          variant="body1"
          component="h3"
          margin="5px 0 2px 22px"
          color="var(--adm-color-neutral-800)"
        >
          {friend.fullName}
        </Typography>
      </ListItem>
    </>
  )
}
