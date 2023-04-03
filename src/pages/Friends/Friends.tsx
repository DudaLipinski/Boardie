import { Typography } from '@mui/material'
import { Motion } from '../../components/Motion'

export const Friends = () => {
  return (
    <Motion
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignSelf: 'center',
      }}
    >
      <Typography align="center" variant="body2" component="p" marginTop="8px">
        Friends coming soon
      </Typography>
    </Motion>
  )
}
