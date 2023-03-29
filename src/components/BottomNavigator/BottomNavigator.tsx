import * as React from 'react'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import CasinoIcon from '@mui/icons-material/Casino'
import PeopleIcon from '@mui/icons-material/People'
import { useRouter } from 'next/router'
import { FRIENDS, MATCHES } from '@/routes/routeSpecs'

export default function BottomNavigator() {
  const router = useRouter()

  return (
    <Box>
      <BottomNavigation
        showLabels
        sx={{ borderRadius: '0 0 20px 20px', zIndex: 2 }}
      >
        <BottomNavigationAction
          label="Matches"
          icon={<CasinoIcon />}
          onClick={() => router.push(MATCHES)}
        />
        <BottomNavigationAction
          label="Friends"
          icon={<PeopleIcon />}
          onClick={() => router.push(FRIENDS)}
        />
      </BottomNavigation>
    </Box>
  )
}
