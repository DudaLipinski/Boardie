/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from '@mui/material'
import { useEffect } from 'react'
import { TabBar } from '@components/organisms/TabBar'
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
    <Box
      height="inherit"
      display="flex"
      flexDirection="column"
      width="inherit"
      justifyContent="space-between"
    >
      <Box
        component="main"
        padding="0 24px"
        height="inherit"
        overflow="hidden auto"
        display="flex"
      >
        {isLoading ? null : <AuthenticatedRoutes />}
      </Box>
      <TabBar user={user} />
    </Box>
  )
}
