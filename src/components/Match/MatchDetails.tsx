import { useCallback } from 'react'
import { Controller } from 'react-hook-form'
import { Control } from 'react-hook-form'
import { Match } from '@src/types/Match'

import { Stack, TextField, Grid, Box } from '@mui/material'
import { MobileDateTimePicker } from '@mui/x-date-pickers'

interface Props {
  control: Control<Match>
}

export const MatchDetails = ({ control }: Props) => {
  const renderDateInput = useCallback(
    (params: any) => <TextField {...params} />,
    []
  )

  return (
    <Box
      component="div"
      bgcolor="background.paper"
      padding="16px"
      marginTop="0!important"
      borderRadius="var(--border-radius)"
    >
      <Stack spacing={2}>
        <Controller
          name="boardgameName"
          control={control}
          render={({ field }) => (
            <TextField
              required
              id="boardgameName"
              type="text"
              fullWidth
              variant="outlined"
              margin="dense"
              label="Boardgame"
              {...field}
            />
          )}
        />
        <Grid container>
          <Grid item xs={6} sx={{ paddingRight: '7px' }}>
            <Controller
              name="startedAt"
              control={control}
              render={({ field }) => (
                <MobileDateTimePicker
                  label="Started at"
                  renderInput={renderDateInput}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sx={{ paddingLeft: '7px', fontSize: '12px' }}>
            <Controller
              name="endedAt"
              control={control}
              render={({ field }) => (
                <MobileDateTimePicker
                  {...field}
                  value={field.value || undefined}
                  label="Ended at"
                  renderInput={renderDateInput}
                />
              )}
            />
          </Grid>
        </Grid>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextField
              multiline
              variant="outlined"
              rows={4}
              id="notes"
              label="Notes"
              {...field}
            />
          )}
        />
      </Stack>
    </Box>
  )
}
