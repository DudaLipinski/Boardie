import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { Match as MatchType } from '../../types/Match'
import { useMatchCreation } from '../../queries/match'
import { useInitialParticipants } from '../../hooks/useInitialParticipants'

import { MatchParticipants } from '../../components/CreateMatch/MatchParticipants'
import { MatchDetails } from '../../components/CreateMatch/MatchDetails'
import { Box, Fab, Stack, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CachedIcon from '@mui/icons-material/Cached'

import { animationProps } from '../../styles/animation'
import { styledFloatButton } from '../../styles/floatingButton'
import { Alert } from '../../components/Alert'

const fabProps = {
  color: 'primary' as const,
  variant: 'extended' as const,
  sx: { ...styledFloatButton },
  type: 'submit' as const,
}

const fabTextProps = {
  variant: 'button' as const,
  fontSize: 14,
  component: 'h2' as const,
  sx: { mr: 0.5 },
}

export const Match = () => {
  const { mutate, isLoading, isError, error } = useMatchCreation()

  const { handleSubmit, control } = useForm<MatchType>({
    defaultValues: {
      boardgameName: '',
      startedAt: dayjs(),
      endedAt: null,
      notes: '',
      participants: useInitialParticipants(),
    },
  })

  const onSubmit = (value: MatchType) => {
    const formatedStartedAt = dayjs.utc(value.startedAt).toISOString()
    const formatedEndedAt = value.endedAt
      ? dayjs.utc(value.endedAt).toISOString()
      : value.endedAt

    const match = {
      ...value,
      startedAt: formatedStartedAt,
      endedAt: formatedEndedAt,
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
        {isError && (
          <Alert severity="error" message={error.response.data.message} />
        )}
        <Stack spacing={2} overflow="hidden auto" height="inherit">
          <MatchDetails control={control} />
          <MatchParticipants control={control} />
        </Stack>
        <Fab disabled={isLoading} {...fabProps}>
          {isLoading ? <CachedIcon /> : <CheckIcon />}
          <Typography {...fabTextProps}>
            {isLoading ? 'Creating' : 'Confirm'}
          </Typography>
        </Fab>
      </Box>
    </motion.div>
  )
}
