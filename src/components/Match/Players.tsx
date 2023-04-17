import { Box, Typography, Button, Stack } from '@mui/material'
import { useCallback } from 'react'
import { Control, useFieldArray } from 'react-hook-form'
import { Match } from '../../types/Match'
import { Player } from './Player'

interface Props {
  control: Control<Match>
}
export const Players = ({ control }: Props) => {
  const {
    fields: players,
    append,
    remove,
  } = useFieldArray({
    name: 'players',
    control,
  })

  const addPlayer = useCallback(() => {
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

  const isUniquePlayer = players.length === 1

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingTop="14px"
      >
        <Typography variant="h3" component="h3">
          Players
        </Typography>
        <Button
          variant="outlined"
          size="small"
          type="button"
          onClick={addPlayer}
        >
          Add new +
        </Button>
      </Box>
      <Stack
        spacing={2}
        paddingBottom="90px"
        component="ul"
        sx={{ padding: 0 }}
      >
        {players.map((player, index) => (
          <Player
            isUniquePlayer={isUniquePlayer}
            key={player.id}
            index={index}
            onRemove={remove}
            control={control}
          />
        ))}
      </Stack>
    </>
  )
}
