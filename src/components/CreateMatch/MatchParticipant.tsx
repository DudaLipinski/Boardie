import { ChangeEventHandler } from 'react'
import { Participant } from '../../types/Match'
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
import { ParticipantSelector } from './ParticipantSelector'

interface Props {
  participant: Participant
  index: number
  handleChange: ChangeEventHandler<HTMLInputElement>
  setFieldValue: (fieldName: string, value: any) => void
  removeParticipant: (index: number) => void
}

export const MatchParticipant = ({
  participant,
  index,
  handleChange,
  setFieldValue,
  removeParticipant,
}: Props) => {
  const { fullName } = participant.friend

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
        <Avatar
          alt={fullName}
          src=""
          sx={{ width: 60, height: 60, margin: '5px 5px 0 0' }}
        >
          {fullName[0]}
        </Avatar>
      </Box>
      <Box>
        <TextField
          fullWidth
          size="small"
          type="text"
          variant="outlined"
          margin="dense"
          sx={{ marginBottom: '12px' }}
          id={`participants[${index}].friend.fullName`}
          name={`participants[${index}].friend.fullName`}
          label="Participant"
          value={fullName}
          onChange={handleChange}
        />
        {/* <ParticipantSelector
          index={index}
          value={fullName}
          setFieldValue={setFieldValue}
        /> */}
        <Grid key={index} container gap="16px">
          <Grid item xs={6} sx={{ marginTop: '8px' }}>
            <TextField
              size="small"
              type="number"
              variant="outlined"
              id={`participants[${index}].score`}
              name={`participants[${index}].score`}
              label="Score"
              InputLabelProps={{
                shrink: true,
              }}
              value={participant.score}
              onChange={handleChange}
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
                <Checkbox
                  checked={participant.isWinner}
                  value={participant.isWinner}
                  id={`participants[${index}].isWinner`}
                  name={`participants[${index}].isWinner`}
                  onChange={handleChange}
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
          onClick={() => removeParticipant(index)}
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
      </Box>
    </Box>
  )
}
