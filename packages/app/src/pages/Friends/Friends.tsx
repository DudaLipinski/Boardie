import { Box, Button, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Trans } from '@lingui/macro'
import { AnonFriendCard } from './AnonFriendCard'
import { FriendshipRequests } from './FriendshipRequests'
import { SendFriendRequestModal } from './SendFriendRequestModal'
import { FriendCard } from './FriendCard'
import Header from '@components/Header'
import { Tooltip } from '@components/Tooltip'
import { useFriends, useFriendshipRequests } from '@src/queries/friends'
import { Motion } from '@components/Motion'

const Friends = () => {
  const [openFriendRequestModal, setOpenFriendRequestModal] = useState(false)
  const { data: friends } = useFriends()
  const { data: friendsRequests } = useFriendshipRequests()

  const anonFriends = useMemo(
    () => friends?.filter((friend) => friend.type === 'ANON_FRIEND'),
    [friends],
  )

  const userFriends = useMemo(
    () => friends?.filter((friend) => friend.type === 'USER'),
    [friends],
  )

  const userFriendsCards = useMemo(
    () =>
      userFriends?.map((friend) => (
        <FriendCard key={friend.id} friend={friend} />
      )),
    [userFriends],
  )

  const anonFriendsCards = useMemo(
    () =>
      anonFriends?.map((friend) => (
        <AnonFriendCard key={friend.id} friend={friend} />
      )),
    [anonFriends],
  )

  return (
    <Motion style={{ width: '100%' }}>
      <Box>
        <Header title="Friends">
          <Button
            variant="contained"
            size="small"
            type="button"
            onClick={() => setOpenFriendRequestModal(true)}
          >
            <Trans>Add friend</Trans>
          </Button>
        </Header>

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
          <>
            <Typography
              variant="h3"
              component="h2"
              margin="20px 0"
              fontWeight="600"
            >
              <Trans>Anonymous friends</Trans>
            </Typography>

            <div className="mt-1 p-3 flex rounded-md bg-purple-200/10">
              <div>
                <p>
                  <Trans>
                    Your friends can join <em>Boardie</em> to replace their anon
                    placeholders.{' '}
                  </Trans>{' '}
                  <span className="text-pink-400">
                    <Trans>Invite them</Trans>{' '}
                    <FavoriteIcon
                      fontSize="inherit"
                      sx={{ display: 'inline' }}
                    />
                  </span>
                </p>
              </div>
              <div className="flex items-start ml-1 -mt-[0.2em]">
                <Tooltip
                  content={
                    <p className="text-sm max-w-[15em] text-center">
                      <Trans>
                        All match participations will be transferred to the
                        invited friend.
                      </Trans>
                    </p>
                  }
                >
                  <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                </Tooltip>
              </div>
            </div>

            <Box component="ul" sx={{ padding: '16px 0 40px 0', margin: 0 }}>
              {anonFriendsCards}
            </Box>
          </>
        ) : null}
      </Box>
    </Motion>
  )
}

export default Friends
