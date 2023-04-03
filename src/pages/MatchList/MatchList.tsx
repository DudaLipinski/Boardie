import { useNavigate } from 'react-router-dom'
import { Fab, List, Box, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CircularProgress from '@mui/material/CircularProgress'
import { useMatches } from '../../queries/match'
import { Match } from '../../types/Match'
import { getErrorMessage } from '../../utils/api'
import { CREATE_MATCH } from '../../routes/routeSpecs'

import { MatchCard } from '../../components/MatchCard/MatchCard'
import { styledFloatButton } from '../../styles/floatingButton'
import { Alert } from '../../components/Alert'
import { Motion } from '../../components/Motion'

export const MatchList = () => {
  const navigate = useNavigate()
  const { data, isError, error, isLoading } = useMatches()

  const matches = data?.map((match: Match) => {
    return <MatchCard key={match.id} match={match} />
  })

  const listItems = data?.length ? (
    <List>{matches}</List>
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
    <Motion style={{ width: '100%', position: 'relative' }}>
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
    </Motion>
  )
}
