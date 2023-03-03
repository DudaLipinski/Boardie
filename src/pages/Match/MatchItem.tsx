/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from 'formik'

import { motion } from 'framer-motion'

import dayjs, { Dayjs } from 'dayjs'
import {
  Box,
  Grid,
  Stack,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import { useCallback } from 'react'
import React from 'react'
import { createMatch } from '../../services/match'

export const MatchItem = () => {
  const formik = useFormik({
    initialValues: {
      boardgameName: '',
      date: dayjs(),
      duration: 0,
      notes: '',
      participants: [
        {
          fullName: '',
          score: 0,
          isWinner: false,
        },
      ],
    },
    onSubmit: (values) => {
      const date = dayjs(values.date).format('ddd, MMMM D, YYYY')
      const match = { ...values, date: date }

      createMatch(match)
        .then((res) => {
          console.log(res)
        })
        .catch((error) => alert(error.message))
    },
  })

  const handleDateChange = useCallback((value: Dayjs | null) => {
    formik.setFieldValue('date', value)
  }, [])
  const renderDateInput = useCallback(
    (params: any) => <TextField {...params} />,
    []
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ delay: 0.1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ width: '100%' }}
    >
      <Box component="form" gap="12px" onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <TextField
            type="text"
            fullWidth
            variant="outlined"
            margin="dense"
            id="boardgameName"
            label="Board game"
            value={formik.values.boardgameName}
            onChange={formik.handleChange}
          />
          <Grid container sx={{ gap: '16px' }}>
            <Grid item xs={8}>
              <MobileDateTimePicker
                label="Date"
                value={formik.values.date}
                onChange={handleDateChange}
                renderInput={renderDateInput}
              />
            </Grid>
            <Grid item xs>
              <TextField
                type="number"
                variant="outlined"
                id="duration"
                label="Duration"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formik.values.duration}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <TextField
            multiline
            variant="outlined"
            rows={4}
            id="notes"
            label="Notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
          />
          <Grid container sx={{ gap: '16px' }}>
            {formik.values.participants.map((participant, index) => (
              <React.Fragment key={index}>
                <Grid item xs={7}>
                  <TextField
                    type="text"
                    variant="outlined"
                    margin="dense"
                    id={`participants[${index}].fullName`}
                    name={`participants[${index}].fullName`}
                    label="Participant"
                    value={participant.fullName}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={2} sx={{ marginTop: '8px' }}>
                  <TextField
                    type="number"
                    variant="outlined"
                    id={`participants[${index}].score`}
                    name={`participants[${index}].score`}
                    label="Score"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={participant.score}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={1}>
                  <FormControlLabel
                    color="primary"
                    sx={{ color: '#7e7e7e', fontSize: '12px', margin: '0' }}
                    labelPlacement="top"
                    control={
                      <Checkbox
                        checked={formik.values.participants[index].isWinner}
                      />
                    }
                    label="Winner"
                    name={`participants[${index}].isWinner`}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
          <Button fullWidth variant="contained" size="large" type="submit">
            Save
          </Button>
        </Stack>
      </Box>
    </motion.div>
  )
}
