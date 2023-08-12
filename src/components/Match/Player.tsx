import {
  TextField,
  FormControlLabel,
  IconButton,
  Grid,
  Checkbox,
  Box,
} from '@mui/material'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Controller, Control } from 'react-hook-form'
import { Avatar } from '../Avatar'
import { Match } from '../../types/Match'
import { FriendSelector } from '../FriendSelector'

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
  isUniquePlayer: boolean
}

export const Player = ({ index, control, onRemove, isUniquePlayer }: Props) => {
  return (
    <Box
      bgcolor="background.paper"
      padding="16px"
      borderRadius="var(--border-radius)"
      display="flex"
      justifyContent="space-between"
      gap="12px"
    >
      <Box>
        <Controller
          name={`players.${index}.friend`}
          control={control}
          render={({ field: { value: friend } }) => (
            <Avatar user={friend} size="md" />
          )}
        />
      </Box>
      <Box>
        <Controller
          name={`players.${index}.friend`}
          control={control}
          render={({ field: { onChange, value } }) => (
            <FriendSelector index={index} onChange={onChange} value={value} />
          )}
        />
        <Grid container gap="16px" sx={{ marginTop: '14px' }}>
          <Grid item xs={6}>
            <Controller
              name={`players.${index}.score`}
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
                fontSize: '12px',
              }}
              labelPlacement="end"
              control={
                <Controller
                  name={`players.${index}.isWinner`}
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
        {!isUniquePlayer ? (
          <IconButton
            sx={{ padding: '5px' }}
            aria-label="remove player"
            onClick={() => onRemove(index)}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        ) : (
          <Box width="34px" />
        )}
      </Box>
    </Box>
  )
}
