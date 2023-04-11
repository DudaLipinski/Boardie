import { Box, Button, ListItem, Typography } from '@mui/material'
import { Avatar } from '../Avatar'
import { useAnswerFriendshipRequest } from '../../queries/friends'
import { FriendshipRequest } from '../../types/Friend'
import { Alert } from '../Alert'
import { getErrorMessage } from '../../utils/api'

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

export const FriendshipRequestCard = ({
  friendshipRequest,
}: {
  friendshipRequest: FriendshipRequest
}) => {
  const { mutate, isError, error } = useAnswerFriendshipRequest()

  const handleAccept = () =>
    mutate({ requestingUserId: friendshipRequest.userId, accept: true })

  const handleIgnore = () =>
    mutate({ requestingUserId: friendshipRequest.userId, accept: false })

  return (
    <>
      {isError && <Alert severity="error" message={getErrorMessage(error)} />}
      <ListItem sx={{ ...styledListItem }}>
        <Avatar
          user={{
            ...friendshipRequest,
            type: 'USER',
            id: friendshipRequest.userId,
          }}
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
          <Box
            display="flex"
            flexDirection="row"
            gap="12px"
            margin="0 0 0 14px"
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleAccept}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ opacity: '0.6' }}
              onClick={handleIgnore}
            >
              Ignore
            </Button>
          </Box>
        </Box>
      </ListItem>
    </>
  )
}
