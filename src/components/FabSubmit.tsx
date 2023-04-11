import { CircularProgress, Fab, Typography } from '@mui/material'

import CheckIcon from '@mui/icons-material/Check'
import { styledFloatButton } from '../styles/floatingButton'

const fabProps = {
  color: 'primary' as const,
  variant: 'extended' as const,
  sx: { ...styledFloatButton },
  type: 'submit' as const,
}

const fabTextProps = {
  variant: 'button' as const,
  fontSize: 14,
  component: 'p' as const,
  sx: { mr: 0.5 },
}

export const FabSubmit = ({ isLoading }: { isLoading: boolean }) => (
  <Fab disabled={isLoading} {...fabProps}>
    {isLoading ? null : <CheckIcon />}
    {isLoading ? (
      <CircularProgress size="24px" />
    ) : (
      <Typography {...fabTextProps}>Save</Typography>
    )}
  </Fab>
)
