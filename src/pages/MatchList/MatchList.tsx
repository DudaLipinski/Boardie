import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMatches } from '../../queries/match'
import { Match } from '../../types/Match'
import { getErrorMessage } from '../../utils/api'
import { CREATE_MATCH } from '../../routes/routeSpecs'

import { motion } from 'framer-motion'
import { Fab, List, Box, Typography } from '@mui/material'
import { MatchCard } from '../../components/MatchCard/MatchCard'
import AddIcon from '@mui/icons-material/Add'
import { animationProps } from '../../styles/animation'
import { styledFloatButton } from '../../styles/floatingButton'
import { Alert } from '../../components/Alert'
import CircularProgress from '@mui/material/CircularProgress'

export const MatchList = () => {
  const navigate = useNavigate()
  const { data, isError, error, isLoading } = useMatches()

  const matches = useMemo(
    () =>
      data?.map((match: Match) => {
        return <MatchCard key={match.id} match={match} />
      }),
    [data]
  )

  const listItems = data?.length ? (
    <List sx={{ paddingBottom: '80px' }}>{matches}</List>
  ) : (
    <Typography align="center">Start creating your first match! :)</Typography>
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
    <motion.div
      {...animationProps}
      style={{ width: '100%', position: 'relative' }}
    >
      {isError && <Alert severity="error" message={getErrorMessage(error)} />}
      {content}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ ...styledFloatButton }}
        onClick={() => navigate(CREATE_MATCH)}
      >
        <AddIcon />
      </Fab>
    </motion.div>
  )
}
