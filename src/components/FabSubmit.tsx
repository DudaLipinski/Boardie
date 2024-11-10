import { CircularProgress, Fab, Typography } from '@mui/material'

import CheckIcon from '@mui/icons-material/Check'
import { styledFloatButton } from '../styles/floatingButton'

export const FabSubmit = ({ isLoading }: { isLoading: boolean }) => (
  <Fab
    disabled={isLoading}
    color="primary"
    variant="extended"
    type="submit"
    sx={{ ...styledFloatButton }}
  >
    {isLoading ? (
      <CircularProgress size="24px" sx={{ color: '#000' }} />
    ) : (
      <>
        <CheckIcon fontSize="small" sx={{ marginRight: '4px' }} />
        <Typography variant="button" fontSize={14}>
          Save
        </Typography>
      </>
    )}
  </Fab>
)
