import { Box, Button, ListItem, Typography } from '@mui/material'
import { Avatar } from '@components/Avatar'
import { Alert } from '@components/Alert'
import { useAnswerFriendshipRequest } from '@src/queries/friends'
import { FriendshipRequest } from '@src/types/Friend'
import { getErrorMessage } from '@src/utils/api'
import { styledCard } from '@src/styles/card'

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
      <ListItem
        sx={{ ...styledCard, padding: '18px 15px', alignItems: 'center' }}
      >
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
            <Button variant="contained" color="primary" onClick={handleAccept}>
              Accept
            </Button>
            <Button variant="outlined" color="primary" onClick={handleIgnore}>
              Ignore
            </Button>
          </Box>
        </Box>
      </ListItem>
    </>
  )
}
