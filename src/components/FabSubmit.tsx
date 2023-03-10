import { Fab, Typography } from '@mui/material'
import { styledFloatButton } from '../styles/floatingButton'
import CheckIcon from '@mui/icons-material/Check'
import CachedIcon from '@mui/icons-material/Cached'

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

export const FabSubmit = ({ isLoading }: { isLoading: boolean }) => {
  return isLoading ? (
    <Fab disabled {...fabProps}>
      <CachedIcon sx={{ mr: 0.5 }} />
      <Typography {...fabTextProps}>Creating</Typography>
    </Fab>
  ) : (
    <Fab {...fabProps}>
      <CheckIcon sx={{ mr: 0.5 }} />
      <Typography {...fabTextProps}>Confirm</Typography>
    </Fab>
  )
}
