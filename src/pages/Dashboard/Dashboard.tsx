import { Typography } from '@mui/material'
import { Motion } from '@components/Motion'
import { Trans } from '@lingui/macro'

const Dashboard = () => {
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
        <Trans>Dashboards coming soon</Trans>
      </Typography>
    </Motion>
  )
}

export default Dashboard
