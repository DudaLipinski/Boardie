import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'

import { MatchParticipants } from '../../components/CreateMatch/MatchParticipants'
import { MatchInfoFields } from '../../components/CreateMatch/MatchInfoFields'
import { Box, Stack } from '@mui/material'

import { animationProps } from '../../styles/animation'
import { useInitialParticipants } from '../../hooks/useInitialParticipants'
import { Match as MatchType } from '../../types/Match'
import { useMatchCreation } from '../../queries/match'
import { FabSubmit } from '../../components/FabSubmit'

export const Match = () => {
  const createMatch = useMatchCreation()

  const { handleSubmit, control } = useForm<MatchType>({
    defaultValues: {
      boardgameName: '',
      startedAt: dayjs(),
      endedAt: dayjs(),
      notes: '',
      participants: useInitialParticipants(),
    },
  })

  const onSubmit = (value: MatchType) => {
    const formatedStartedAt = dayjs.utc(value.startedAt).toISOString()
    const formatedEndedAt = dayjs.utc(value.endedAt).toISOString()

    const match = {
      ...value,
      startedAt: formatedStartedAt,
      endedAt: formatedEndedAt,
    }

    createMatch.mutate(match)
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
        <Stack spacing={2} overflow="hidden auto" height="inherit">
          <MatchInfoFields control={control} />
          <MatchParticipants control={control} />
        </Stack>
        <FabSubmit isLoading={createMatch.isLoading} />
      </Box>
    </motion.div>
  )
}
