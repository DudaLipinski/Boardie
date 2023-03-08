import { useSelector } from 'react-redux'
import { selectors as userSelectors } from '../../state/user'
import {
  TextField,
  FormControlLabel,
  Grid,
  Checkbox,
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  IconButton,
} from '@mui/material'
import { ChangeEventHandler } from 'react'
import { Participant } from '../../types/Match'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

interface Props {
  participants: Participant[]
  handleChange: ChangeEventHandler<HTMLInputElement>
}

export const MatchParticipants = ({ participants, handleChange }: Props) => {
  return (
    <>
      <Box display="flex" justifyContent={'space-between'}>
        <Typography variant="h3" component={'h2'}>
          Participants
        </Typography>
        <Button variant="outlined" size="small" type="submit">
          Add new +
        </Button>
      </Box>
      <Stack spacing={2}>
        {participants.map((participant, index) => {
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
                  id={`participants[${index}].fullName`}
                  name={`participants[${index}].fullName`}
                  label="Participant"
                  value={fullName}
                  onChange={handleChange}
                />
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
                      control={<Checkbox checked={participant.isWinner} />}
                      label="Winner"
                      name={`participants[${index}].isWinner`}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <IconButton aria-label="delete">
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Box>
            </Box>
          )
        })}
      </Stack>
    </>
  )
}
