import { Box } from '@mui/material'
import Navbar from './Navbar/Navbar'
import BottomNavigator from './BottomNavigator/BottomNavigator'
import { ReactNode } from 'react'

export const AuthenticatedLayout = ({ children }: { children: ReactNode }) => {
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
        {children}
      </Box>
      <BottomNavigator />
    </Box>
  )
}
