/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from '@mui/material'
import { useEffect } from 'react'
import { TabBar } from '../components/TabBar/TabBar'
import { setUnauthorizedHandler } from '../utils/api'
import { useUser } from '../queries/user'
import { AuthenticatedRoutes } from './AuthenticatedRoutes'

import { useLogout } from './useLogout'

export const AuthenticatedWrapper = () => {
  const { data: user, isLoading } = useUser()
  const logout = useLogout()

  useEffect(() => {
    const clearUnauthorizedHandler = setUnauthorizedHandler(logout)
    return clearUnauthorizedHandler
  }, [])

  if (!user) {
    return null
  }

  return (
    <Box height="inherit" display="flex" flexDirection="column" width="inherit">
      <Box
        display="flex"
        padding="24px 24px 0 24px"
        flex="1"
        height="inherit"
        overflow="hidden auto"
        component="main"
      >
        {isLoading ? null : <AuthenticatedRoutes />}
      </Box>
      <TabBar user={user} />
    </Box>
  )
}
