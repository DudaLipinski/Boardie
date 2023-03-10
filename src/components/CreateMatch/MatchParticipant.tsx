import { Match } from '../../types/Match'
import {
  TextField,
  FormControlLabel,
  IconButton,
  Avatar,
  Grid,
  Checkbox,
  Box,
} from '@mui/material'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Controller, Control } from 'react-hook-form'
import { ParticipantSelector } from '../FriendSelector'

interface Props {
  index: number
  fullName: string
  control: Control<Match>
  onRemove: (index: number) => void
}

export const MatchParticipant = ({ index, control, onRemove }: Props) => {
  return (
    <Box
      bgcolor="background.paper"
      padding="16px"
      borderRadius="8px"
      display="flex"
      justifyContent="space-between"
      gap="12px"
    >
      <Box>
        <Controller
          name={`participants.${index}.friend`}
          control={control}
          render={({ field: { value: friend } }) => {
            const fullName = friend?.fullName ?? ''
            const splitFullName = fullName.split(' ')
            const [firstName] = splitFullName
            const lastName =
              splitFullName.length > 1
                ? splitFullName[splitFullName.length - 1]
                : ''

            return (
              <Avatar
                alt={fullName}
                src=""
                sx={{ width: 60, height: 60, margin: '5px 5px 0 0' }}
              >
                {firstName[0]?.toUpperCase()} {lastName[0]?.toUpperCase()}
              </Avatar>
            )
          }}
        />
      </Box>
      <Box>
        <Controller
          name={`participants.${index}.friend`}
          control={control}
          render={({ field: { onChange, value } }) => (
            <ParticipantSelector
              index={index}
              onChange={onChange}
              value={value}
            />
          )}
        />

        <Grid key={index} container gap="16px">
          <Grid item xs={6} sx={{ marginTop: '8px' }}>
            <Controller
              name={`participants.${index}.score`}
              control={control}
              render={({ field }) => (
                <TextField
                  size="small"
                  type="number"
                  variant="outlined"
                  label="Score"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <FormControlLabel
              color="primary"
              sx={{
                color: '#7e7e7e',
                fontSize: '12px',
                marginTop: '4px',
              }}
              labelPlacement="end"
              control={
                <Controller
                  name={`participants.${index}.isWinner`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox checked={field.value} {...field} />
                  )}
                />
              }
              label="Winner"
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <IconButton
          aria-label="remove participant"
          onClick={() => onRemove(index)}
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
      </Box>
    </Box>
  )
}
