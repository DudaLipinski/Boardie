import { Box, Typography, Button, Stack } from '@mui/material'
import { ChangeEventHandler, useCallback } from 'react'
import { Participant } from '../../types/Match'
import { MatchParticipant } from './MatchParticipant'

interface Props {
  participants: Participant[]
  handleChange: ChangeEventHandler<HTMLInputElement>
  setFieldValue: (fieldName: string, value: any) => void
}

export const MatchParticipants = ({
  participants,
  handleChange,
  setFieldValue,
}: Props) => {
  const addParticipant = useCallback(() => {
    participants.push({
      score: 0,
      isWinner: false,
      friend: {
        id: 0,
        fullName: '',
        type: '',
      },
    })
    setFieldValue('participants', participants)
  }, [participants, setFieldValue])

  const removeParticipant = useCallback(
    (index: number) => {
      participants.splice(index, 1)
      setFieldValue('participants', participants)
    },
    [participants, setFieldValue]
  )

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
      <Stack spacing={2}>
        {participants.map((participant, index) => (
          <MatchParticipant
            key={index}
            participant={participant}
            index={index}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
            removeParticipant={removeParticipant}
          />
        ))}
      </Stack>
    </>
  )
}
