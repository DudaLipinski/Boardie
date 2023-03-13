import { Fab, Typography } from '@mui/material'

import CheckIcon from '@mui/icons-material/Check'
import CachedIcon from '@mui/icons-material/Cached'
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
  component: 'h2' as const,
  sx: { mr: 0.5 },
}

export const FabSubmit = ({ isLoading }: { isLoading: boolean }) => (
  <Fab disabled={isLoading} {...fabProps}>
    {isLoading ? <CachedIcon /> : <CheckIcon />}
    <Typography {...fabTextProps}>
      {isLoading ? 'Creating' : 'Confirm'}
    </Typography>
  </Fab>
)
