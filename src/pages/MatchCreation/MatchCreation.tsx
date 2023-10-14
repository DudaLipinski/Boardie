import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Match as MatchType } from '@src/types/Match'
import { useMatchCreation } from '@src/queries/match'
import { useUser } from '@src/queries/user'
import { userToPlayer } from '@src/utils/friends'
import { getErrorMessage } from '@src/utils/api'
import { EDIT_MATCH } from '@src/routes/routeSpecs'

import { Box, Button, Stack } from '@mui/material'
import { Players } from '@components/Match/Players'
import { MatchDetails } from '@components/Match/MatchDetails'
import { Alert } from '@components/Alert'
import { FabSubmit } from '@components/FabSubmit'
import { Motion } from '@components/Motion'
import { Title } from '@components/Title'

import CloseIcon from '@mui/icons-material/Close'

const MatchCreation = () => {
  const navigate = useNavigate()
  const { data: user } = useUser()
  const { mutate, isLoading, isError, error, isSuccess, data } =
    useMatchCreation()

  const emptyPlayer = {
    score: 0,
    isWinner: false,
    friend: {
      id: 0,
      fullName: '',
      type: 'ANON_FRIEND' as const,
    },
  }

  const { handleSubmit, control } = useForm<MatchType>({
    defaultValues: {
      boardgameName: '',
      startedAt: dayjs(),
      endedAt: null,
      notes: '',
      players: [...(user ? [userToPlayer(user)] : []), emptyPlayer],
    },
  })

  const onSubmit = (value: MatchType) => {
    const formattedStartedAt = dayjs.utc(value.startedAt).toISOString()
    const formattedEndedAt = value.endedAt
      ? dayjs.utc(value.endedAt).toISOString()
      : value.endedAt

    const match = {
      ...value,
      startedAt: formattedStartedAt,
      endedAt: formattedEndedAt,
    }

    mutate(match)

    return
  }

  useEffect(() => {
    if (isSuccess) {
      navigate(EDIT_MATCH.replace(':id', data.id.toString()))
    }
  }, [isSuccess, data?.id, navigate])

  return (
    <Motion>
      <Box
        component="form"
        gap="12px"
        height="100%"
        position="relative"
        onSubmit={handleSubmit(onSubmit)}
      >
        {isError && <Alert severity="error" message={getErrorMessage(error)} />}
        <Stack spacing={2} height="inherit" overflow="hidden auto">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={1}
          >
            <Title title="Create Match" />
            <Button
              aria-label="Close"
              onClick={() => navigate(-1)}
              variant="outlined"
              sx={{ minWidth: '20px', padding: '8px 8px' }}
            >
              <CloseIcon />
            </Button>
          </Box>
          <MatchDetails control={control} />
          <Players control={control} />
        </Stack>
        <FabSubmit isLoading={isLoading} />
      </Box>
    </Motion>
  )
}

export default MatchCreation
