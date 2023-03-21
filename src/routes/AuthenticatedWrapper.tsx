/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from '@mui/material'
import { useEffect } from 'react'
import { TabBar } from '../components/TabBar/TabBar'
import { Navbar } from '../components/Navbar/Navbar'
import { setUnauthorizedHandler } from '../utils/api'
import { useUser } from '../queries/user'
import { AuthenticatedRoutes } from './AuthenticatedRoutes'

import { useLogout } from './useLogout'

export const AuthenticatedWrapper = () => {
  const user = useUser()
  const logout = useLogout()

  useEffect(() => {
    const clearUnauthorizedHandler = setUnauthorizedHandler(logout)
    return clearUnauthorizedHandler
  }, [])

  return (
    <Box height="inherit" display="flex" flexDirection="column" width="inherit">
      <Navbar />
      <Box
        display="flex"
        flex="1"
        height="inherit"
        overflow="hidden auto"
        component="main"
      >
        {user.isLoading ? null : <AuthenticatedRoutes />}
      </Box>
      <TabBar />
    </Box>
  )
}
