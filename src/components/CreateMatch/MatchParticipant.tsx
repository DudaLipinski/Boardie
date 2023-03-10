import { Match } from '../../types/Match'
import {
  TextField,
  FormControlLabel,
  IconButton,
  Grid,
  Checkbox,
  Box,
} from '@mui/material'
import { Avatar } from '../Avatar'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Controller, Control } from 'react-hook-form'
import { ParticipantSelector } from '../FriendSelector'

const parseEventValueToInt = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => ({
  ...event,
  target: {
    ...event.target,
    value: event.target.value ? parseInt(event.target.value) : null,
  },
})

interface Props {
  index: number
  control: Control<Match>
  onRemove: (index: number) => void
  isUniqueParticipant: boolean
}

export const MatchParticipant = ({
  index,
  control,
  onRemove,
  isUniqueParticipant,
}: Props) => {
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
          render={({ field: { value: friend } }) => (
            <Avatar user={friend} size="md" />
          )}
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
        <Grid container gap="16px" sx={{ marginTop: '14px' }}>
          <Grid item xs={6}>
            <Controller
              name={`participants.${index}.score`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  size="small"
                  type="number"
                  variant="outlined"
                  label="Score"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={value}
                  onChange={(event) => onChange(parseEventValueToInt(event))}
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
        {!isUniqueParticipant ? (
          <IconButton
            sx={{ padding: '5px 0' }}
            aria-label="remove participant"
            onClick={() => onRemove(index)}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        ) : (
          <Box width="24px" />
        )}
      </Box>
    </Box>
  )
}
