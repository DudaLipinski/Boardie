import { Typography } from '@mui/material'
import { Motion } from '../../components/Motion'

export const Dashboard = () => {
  return (
    <Motion
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
      }}
    >
      <Typography align="center" variant="body2" component="p">
        Dashboards coming soon
      </Typography>
    </Motion>
  )
}
