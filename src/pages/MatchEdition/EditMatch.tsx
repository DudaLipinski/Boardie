import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { Box, Stack } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import pick from 'lodash.pick'
import { Match as MatchType } from '../../types/Match'
import { useMatch, useMatchUpdate } from '../../queries/match'

import { MatchParticipants } from '../../components/Match/MatchParticipants'
import { MatchDetails } from '../../components/Match/MatchDetails'

import { FabSubmit } from '../../components/FabSubmit'
import { getErrorMessage } from '../../utils/api'
import { Alert } from '../../components/Alert'
import { FullScreenLoader } from '../../components/FullScreenLoader'
import { Motion } from '../../components/Motion'

export const MatchEdition = () => {
  const { id } = useParams()
  const matchId = id ? parseInt(id) : 0

  const [isReady, setIsReady] = useState(false)

  const { data, isLoading: isLoadingMatch, isError, error } = useMatch(matchId)
  const { mutate: mutateMatchDetails } = useMatchUpdate()

  const { handleSubmit, control, reset } = useForm<MatchType>({
    defaultValues: {
      boardgameName: '',
      startedAt: '',
      endedAt: '',
      notes: '',
      participants: [],
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
          'participants',
        ])
      )
    }

    if (isLoadingMatch === false) {
      setIsReady(true)
    }
  }, [data, isLoadingMatch, reset])

  const onSubmit = (value: MatchType) => {
    const initialParticipants = data?.participants
    const receivedParticipants = value.participants
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

    mutateMatchDetails(matchDetails)

    if (!receivedParticipants || !initialParticipants) {
      return
    }

    const deletedParticipants = initialParticipants?.filter(
      (oldParticipant) =>
        !receivedParticipants.find(
          (newParticipant) => newParticipant.id === oldParticipant.id
        )
    )

    const updatedParticipants = receivedParticipants.filter(
      (receivedParticipant) => {
        const oldParticipant = initialParticipants.find(
          (participant) => participant.id === receivedParticipant.id
        )
        return (
          oldParticipant &&
          JSON.stringify(receivedParticipant) !== JSON.stringify(oldParticipant)
        )
      }
    )

    const newParticipants = receivedParticipants
      .filter((participant) => !('id' in participant))
      .map((participant) => {
        return {
          ...participant,
          matchId: matchId,
        }
      })
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
            <MatchDetails control={control} />
            <MatchParticipants control={control} />
          </Stack>
          <FabSubmit isLoading={false} />
        </Box>
      ) : (
        <FullScreenLoader />
      )}
    </Motion>
  )
}
