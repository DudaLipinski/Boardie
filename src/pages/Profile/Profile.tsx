import { motion } from 'framer-motion'
import { Box, Button, Typography } from '@mui/material'
import { animationProps } from '../../styles/animation'
import { useUser } from '../../queries/user'
import { useLogout } from '../../routes/useLogout'

export const Profile = () => {
  const { data: user } = useUser()
  const logout = useLogout()

  return (
    <motion.div {...animationProps} style={{ width: '100%' }}>
      <Box width="inherit">
        <Typography variant="h4" component="h1">
          Profile
        </Typography>
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
    </motion.div>
  )
}
