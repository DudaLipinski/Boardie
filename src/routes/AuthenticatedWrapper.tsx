import { TabBar } from '../components/TabBar/TabBar'
import { Navbar } from '../components/Navbar/Navbar'
import { AuthenticatedRoutes } from './AuthenticatedRoutes'
import { Box } from '@mui/material'

export const AuthenticatedWrapper = () => {
  return (
    <Box height="100vh" display="flex" flexDirection="column" width="inherit">
      <Navbar />
      <Box
        display="flex"
        flex="1"
        height="inherit"
        overflow="hidden auto"
        component="main"
      >
        <AuthenticatedRoutes />
      </Box>
      <TabBar />
    </Box>
  )
}
