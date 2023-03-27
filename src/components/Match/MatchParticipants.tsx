import { Box, Typography, Button, Stack } from '@mui/material'
import { useCallback } from 'react'
import { Control, useFieldArray } from 'react-hook-form'
import { Match } from '../../types/Match'
import { MatchParticipant } from './MatchParticipant'

interface Props {
  control: Control<Match>
}
export const MatchParticipants = ({ control }: Props) => {
  const {
    fields: participants,
    append,
    remove,
  } = useFieldArray({
    name: 'participants',
    control,
  })

  const addParticipant = useCallback(() => {
    append({
      score: 0,
      isWinner: false,
      friend: {
        id: 0,
        fullName: '',
        type: 'ANON_FRIEND',
      },
    })
  }, [append])

  const isUniqueParticipant = participants.length === 1

  return (
    <>
      <Box display="flex" justifyContent={'space-between'}>
        <Typography variant="h3" component={'h2'}>
          Participants
        </Typography>
        <Button
          variant="outlined"
          size="small"
          type="button"
          onClick={addParticipant}
        >
          Add new +
        </Button>
      </Box>
      <Stack spacing={2} paddingBottom="90px">
        {participants.map((participant, index) => (
          <MatchParticipant
            isUniqueParticipant={isUniqueParticipant}
            key={participant.id}
            index={index}
            onRemove={remove}
            control={control}
          />
        ))}
      </Stack>
    </>
  )
}
