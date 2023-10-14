import dayjs from 'dayjs'
import pick from 'lodash.pick'
import omit from 'lodash.omit'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useMatch, useMatchUpdate } from '@src/queries/match'
import { getErrorMessage } from '@src/utils/api'
import { Match as MatchType } from '@src/types/Match'

import { Box, Stack } from '@mui/material'
import { Players } from '@components/Match/Players'
import { MatchDetails } from '@components/Match/MatchDetails'
import { FabSubmit } from '@components/FabSubmit'
import { Alert } from '@components/Alert'
import { FullScreenLoader } from '@components/FullScreenLoader'
import { Motion } from '@components/Motion'
import { Title } from '@components/Title'

const MatchEdition = () => {
  const { id } = useParams()
  const matchId = id ? parseInt(id) : 0

  const [isReady, setIsReady] = useState(false)

  const { data, isLoading: isLoadingMatch, isError, error } = useMatch(matchId)
  const {
    mutate: mutateMatch,
    isError: isErrorMatchUpdate,
    error: errorMatchUpdate,
    isLoading: isLoadingMatchUpdate,
  } = useMatchUpdate()

  const { handleSubmit, control, reset } = useForm<MatchType>({
    defaultValues: {
      boardgameName: '',
      startedAt: '',
      endedAt: '',
      notes: '',
      players: [],
    },
  })

  useEffect(() => {
    if (data) {
      reset(
        pick(data, [
          'boardgameName',
          'startedAt',
          'endedAt',
          'notes',
          'players',
        ])
      )
    }

    if (isLoadingMatch === false) {
      setIsReady(true)
    }
  }, [data, isLoadingMatch, reset])

  const onSubmit = (value: MatchType) => {
    const initialPlayers = data?.players
    const receivedPlayers = value.players
    const formattedStartedAt = dayjs.utc(value.startedAt).toISOString()
    const formattedEndedAt = value.endedAt
      ? dayjs.utc(value.endedAt).toISOString()
      : value.endedAt

    const matchDetails = {
      id: matchId,
      boardgameName: value.boardgameName,
      notes: value.notes,
      startedAt: formattedStartedAt,
      endedAt: formattedEndedAt,
    }

    const updatedPlayers = receivedPlayers
      .filter((receivedPlayer) => {
        const oldPlayer = initialPlayers?.find(
          (player) => player.id === receivedPlayer.id
        )
        return (
          oldPlayer &&
          JSON.stringify(receivedPlayer) !== JSON.stringify(oldPlayer)
        )
      })
      .map((player) => {
        const friend = omit(player.friend, 'fullName')

        return { ...omit(player, 'matchId'), friend: friend }
      })

    const newPlayers = receivedPlayers
      .filter((player) => !('id' in player))
      .map((player) => {
        const friend = omit(player.friend, 'fullName')

        return {
          ...omit(player, 'id'),
          friend: friend,
        }
      })

    const deletedPlayers = initialPlayers
      ?.filter(
        (oldPlayer) =>
          !receivedPlayers.find((newPlayer) => newPlayer.id === oldPlayer.id)
      )
      .map((player) => player.id)

    const matchWithUpdatedPlayers = {
      ...matchDetails,
      players: {
        create: newPlayers.length ? [...newPlayers] : [],
        update: updatedPlayers.length ? [...updatedPlayers] : [],
        delete: deletedPlayers?.length ? [...deletedPlayers] : [],
      },
    }

    mutateMatch(matchWithUpdatedPlayers)
  }

  return (
    <Motion style={{ width: '100%' }}>
      {isReady ? (
        <Box
          component="form"
          gap="12px"
          height="100%"
          position="relative"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isError && (
            <Alert severity="error" message={getErrorMessage(error)} />
          )}
          <Stack spacing={2} overflow="hidden auto" height="inherit">
            {isErrorMatchUpdate && (
              <Alert
                severity="error"
                message={getErrorMessage(errorMatchUpdate)}
              />
            )}
            <Title title="Edit Match" sx={{ paddingBottom: 1 }} />
            <MatchDetails control={control} />
            <Players control={control} />
          </Stack>
          <FabSubmit isLoading={isLoadingMatchUpdate} />
        </Box>
      ) : (
        <FullScreenLoader />
      )}
    </Motion>
  )
}

export default MatchEdition
