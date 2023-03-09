/* eslint-disable react-hooks/exhaustive-deps */

import { motion } from 'framer-motion'
import dayjs, { Dayjs } from 'dayjs'
import { useFormik } from 'formik'
import { createMatch } from '../../services/match'

import { MatchParticipants } from '../../components/CreateMatch/MatchParticipants'
import { MatchInfoFields } from '../../components/CreateMatch/MatchInfoFields'
import { Box, Stack, Fab, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

import { animationProps } from '../../styles/animation'
import { styledFloatButton } from '../../styles/floatingButton'
import { useInitialParticipants } from '../../hooks/useInitialParticipants'

export const Match = () => {
  const formik = useFormik({
    initialValues: {
      boardgameName: '',
      startedAt: dayjs(),
      endedAt: dayjs(),
      notes: '',
      participants: useInitialParticipants(),
    },
    onSubmit: (values) => {
      const formatedStartedAt = dayjs.utc(values.startedAt).toISOString()
      const formatedEndedAt = dayjs.utc(values.endedAt).toISOString()

      const match = {
        ...values,
        startedAt: formatedStartedAt,
        endedAt: formatedEndedAt,
      }

      // createMatch(match)
      //   .then((res) => {
      //     console.log(res)
      //   })
      //   .catch((error) => alert(error.message))
    },
  })

  const handleDateChange = (fieldName: string) => (value: Dayjs | null) => {
    formik.setFieldValue(fieldName, value)
  }

  const { boardgameName, startedAt, endedAt, notes, participants } =
    formik.values

  return (
    <motion.div {...animationProps}>
      <Box
        component="form"
        gap="12px"
        height="100%"
        position="relative"
        onSubmit={formik.handleSubmit}
      >
        <Stack spacing={2}>
          <MatchInfoFields
            handleDateChange={handleDateChange}
            handleChange={formik.handleChange}
            boardgameName={boardgameName}
            startedAt={startedAt}
            endedAt={endedAt}
            notes={notes}
          />
          <MatchParticipants
            participants={participants}
            handleChange={formik.handleChange}
            setFieldValue={(fieldName, value) => {
              formik.setFieldValue(fieldName, value)
            }}
          />
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
