/* eslint-disable react-hooks/exhaustive-deps */

import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'

import { MatchParticipants } from '../../components/CreateMatch/MatchParticipants'
import { MatchInfoFields } from '../../components/CreateMatch/MatchInfoFields'
import { Box, Stack, Fab, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

import { animationProps } from '../../styles/animation'
import { styledFloatButton } from '../../styles/floatingButton'
import { useInitialParticipants } from '../../hooks/useInitialParticipants'
import { Match as MatchType } from '../../types/Match'

export const Match = () => {
  const { handleSubmit, control } = useForm<MatchType>({
    defaultValues: {
      boardgameName: '',
      startedAt: dayjs(),
      endedAt: dayjs(),
      notes: '',
      participants: useInitialParticipants(),
    },
    // onSubmit: (values) => {
    //   const formatedStartedAt = dayjs.utc(values.startedAt).toISOString()
    //   const formatedEndedAt = dayjs.utc(values.endedAt).toISOString()

    //   const match = {
    //     ...values,
    //     startedAt: formatedStartedAt,
    //     endedAt: formatedEndedAt,
    //   }

    //   // createMatch(match)
    //   //   .then((res) => {
    //   //     console.log(res)
    //   //   })
    //   //   .catch((error) => alert(error.message))
    // },
  })

  const onSubmit = (bla: any) => console.log(bla)

  return (
    <motion.div {...animationProps}>
      <Box
        component="form"
        gap="12px"
        height="100%"
        position="relative"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={2}>
          <MatchInfoFields control={control} />
          <MatchParticipants control={control} />
          <Fab
            color="primary"
            variant="extended"
            aria-label="add"
            sx={{ ...styledFloatButton }}
            type="submit"
          >
            <CheckIcon sx={{ mr: 0.5 }} />
            <Typography
              variant="button"
              fontSize={14}
              component={'h2'}
              sx={{ mr: 0.5 }}
            >
              Confirm
            </Typography>
          </Fab>
        </Stack>
      </Box>
    </motion.div>
  )
}
