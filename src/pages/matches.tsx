import { motion } from 'framer-motion'
import { Fab, List, Box, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CircularProgress from '@mui/material/CircularProgress'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMatches } from '@/queries/match'
import { Match } from '@/types/Match'
import { getErrorMessage } from '@/utils/api'
import { CREATE_MATCH, LOGIN } from '@/routes/routeSpecs'

import { MatchCard } from '@/components/MatchCard/MatchCard'
import { animationProps } from '@/styles/animation'
import { styledFloatButton } from '@/styles/floatingButton'
import { Alert } from '@/components/Alert'
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout'
import { useAuth } from '@/core/AuthContext'

const Matches = () => {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  const { data, isError, error, isLoading } = useMatches()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(LOGIN)
      return
    }
  }, [isLoggedIn, router])

  const matches = data?.map((match: Match) => {
    return <MatchCard key={match.id} match={match} />
  })

  const listItems = data?.length ? (
    <List>{matches}</List>
  ) : (
    <Typography align="center" marginTop="24px">
      Start creating your first match! :)
    </Typography>
  )

  const content = isLoading ? (
    <Box sx={{ display: ' flex', justifyContent: 'center', marginTop: '50px' }}>
      <CircularProgress />
    </Box>
  ) : (
    <Box height="100%" overflow="auto">
      {listItems}
    </Box>
  )

  return (
    <AuthenticatedLayout>
      <motion.div
        {...animationProps}
        style={{
          position: 'relative',
          padding: '0 24px',
          width: '100%',
        }}
      >
        {isError && <Alert severity="error" message={getErrorMessage(error)} />}
        {content}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ ...styledFloatButton }}
          onClick={() => router.push(CREATE_MATCH)}
        >
          <AddIcon />
        </Fab>
      </motion.div>
    </AuthenticatedLayout>
  )
}

export default Matches
