import { useUser } from '@src/queries/user'
import { useLogout } from '@src/routes/useLogout'

import { Box, Button, Typography } from '@mui/material'
import { Motion } from '@components/Motion'
import { Title } from '@components/Title'

const Profile = () => {
  const { data: user } = useUser()
  const logout = useLogout()

  return (
    <Motion style={{ width: '100%' }}>
      <Box width="inherit">
        <Title title="Profile" />
        <Typography variant="body1" component="p" margin="10px 0">
          Name: {user?.firstName} {user?.middleAndSurname}
        </Typography>
        <Typography variant="body1" component="p" margin="10px 0">
          E-mail: {user?.email}
        </Typography>
        <Button fullWidth variant="contained" size="small" onClick={logout}>
          Logout
        </Button>
      </Box>
    </Motion>
  )
}

export default Profile
