import { Box, Button, ListItem, Typography } from '@mui/material'
import { GenericUser } from '../../types/GenericUser'
import { Avatar } from '../Avatar'

export const styledListItem = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'start',
  width: 'inherit',
  margin: '0 auto 16px',
  bgcolor: 'background.paper',
  boxShadow: '2px 2px 13px 0px rgb(0 0 0 / 4%)',
  borderRadius: '4px',
  padding: '18px 15px',
}

interface Props {
  friendshipRequest: Omit<GenericUser, 'type'>
}

export const FriendshipRequestCard = ({ friendshipRequest }: Props) => {
  return (
    <ListItem sx={{ ...styledListItem }}>
      <Avatar
        user={{ ...friendshipRequest, type: 'USER' }}
        size="md"
        sx={{
          width: '52px',
          height: '52px',
        }}
      />
      <Box>
        <Typography
          variant="h6"
          component="h3"
          margin="0px 0 4px 14px"
          fontWeight="500"
        >
          {friendshipRequest.fullName}
        </Typography>
        <Box display="flex" flexDirection="row" gap="12px" margin="0 0 0 14px">
          <Button variant="contained" color="primary" size="small">
            Accept
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ opacity: '0.6' }}
          >
            Ignore
          </Button>
        </Box>
      </Box>
    </ListItem>
  )
}
