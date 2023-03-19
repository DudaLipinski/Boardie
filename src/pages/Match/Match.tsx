import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { Match as MatchType } from '../../types/Match'
import { useMatchCreation } from '../../queries/match'
import { useSelector } from 'react-redux'
import { selectors as userSelectors } from '../../state/user'

import { MatchParticipants } from '../../components/CreateMatch/MatchParticipants'
import { MatchDetails } from '../../components/CreateMatch/MatchDetails'
import { Box, Stack } from '@mui/material'

import { animationProps } from '../../styles/animation'
import { Alert } from '../../components/Alert'
import { userToParticipant } from '../../utils/friends'
import { FabSubmit } from '../../components/FabSubmit'
import { getErrorMessage } from '../../utils/api'

export const Match = () => {
  const { mutate, isLoading, isError, error } = useMatchCreation()
  const user = useSelector(userSelectors.getUser)
  const emptyParticipant = {
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
      participants: [userToParticipant(user), emptyParticipant],
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

  return (
    <motion.div {...animationProps}>
      <Box
        component="form"
        gap="12px"
        height="100%"
        position="relative"
        onSubmit={handleSubmit(onSubmit)}
      >
        {isError && <Alert severity="error" message={getErrorMessage(error)} />}
        <Stack spacing={2} overflow="hidden auto" height="inherit">
          <MatchDetails control={control} />
          <MatchParticipants control={control} />
        </Stack>
        <FabSubmit isLoading={isLoading} />
      </Box>
    </motion.div>
  )
}
