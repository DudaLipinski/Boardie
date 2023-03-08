import { Stack, TextField, Grid, Box } from '@mui/material'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs'
import { ChangeEventHandler, useCallback } from 'react'

interface Props {
  handleDateChange: (fieldName: string) => (value: Dayjs | null) => void
  handleChange: ChangeEventHandler<HTMLInputElement>
  boardgameName: string
  startedAt: Dayjs
  endedAt: Dayjs
  notes: string
}

export const MatchInfoFields = ({
  handleDateChange,
  handleChange,
  boardgameName,
  startedAt,
  endedAt,
  notes,
}: Props) => {
  const renderDateInput = useCallback(
    (params: any) => <TextField {...params} />,
    []
  )

  return (
    <Box
      component="div"
      bgcolor="background.paper"
      padding="16px"
      borderRadius="8px"
    >
      <Stack spacing={2}>
        <TextField
          type="text"
          fullWidth
          variant="outlined"
          margin="dense"
          id="boardgameName"
          label="Board game"
          value={boardgameName}
          onChange={handleChange}
        />
        <Grid container>
          <Grid item xs={6} sx={{ paddingRight: '7px' }}>
            <MobileDateTimePicker
              label="Started at"
              value={startedAt}
              onChange={handleDateChange('startedAt')}
              renderInput={renderDateInput}
            />
          </Grid>
          <Grid item xs={6} sx={{ paddingLeft: '7px', fontSize: '12px' }}>
            <MobileDateTimePicker
              label="Ended at"
              value={endedAt}
              onChange={handleDateChange('endedAt')}
              renderInput={renderDateInput}
            />
          </Grid>
        </Grid>
        <TextField
          multiline
          variant="outlined"
          rows={4}
          id="notes"
          label="Notes"
          value={notes}
          onChange={handleChange}
        />
      </Stack>
    </Box>
  )
}
