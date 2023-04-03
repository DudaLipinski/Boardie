import { List, Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useMatches } from '../../queries/match'
import { Match } from '../../types/Match'
import { getErrorMessage } from '../../utils/api'

import { MatchCard } from '../../components/MatchCard/MatchCard'
import { Alert } from '../../components/Alert'
import { Motion } from '../../components/Motion'

export const MatchList = () => {
  const { data, isError, error, isLoading } = useMatches()

  const matches = data?.map((match: Match) => {
    return <MatchCard key={match.id} match={match} />
  })

  const listItems = data?.length ? (
    <List>{matches}</List>
  ) : (
    <Box
      display="flex"
      flexDirection="column"
      alignSelf="center"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Typography>Start creating your first match! :)</Typography>
    </Box>
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
    </Motion>
  )
}
