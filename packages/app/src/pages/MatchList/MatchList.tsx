import { useMemo } from 'react'
import { List, Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { MatchCard } from './MatchCard'
import { useMatches } from '@src/queries/match'
import { Match } from '@src/types/Match'
import { getErrorMessage } from '@src/utils/api'

import { Alert } from '@components/Alert'
import { Motion } from '@components/Motion'
import Header from '@components/Header'

const MatchList = () => {
  const { data: matches, isError, error, isLoading } = useMatches()

  const matchesCards = useMemo(
    () =>
      matches?.map((match: Match) => {
        return <MatchCard key={match.id} match={match} />
      }),
    [matches],
  )

  const listMatches = useMemo(
    () =>
      matches?.length ? (
        <List disablePadding sx={{ paddingBottom: '40px' }}>
          {matchesCards}
        </List>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignSelf="center"
          alignItems="center"
          height="75vh"
          justifyContent="center"
        >
          <Typography>Start creating your first match! :)</Typography>
        </Box>
      ),
    [matches?.length, matchesCards],
  )

  const content = isLoading ? (
    <Box sx={{ display: ' flex', justifyContent: 'center', marginTop: '50px' }}>
      <CircularProgress />
    </Box>
  ) : (
    <>{listMatches}</>
  )

  return (
    <Motion style={{ width: '100%', position: 'relative' }}>
      {isError && <Alert severity="error" message={getErrorMessage(error)} />}
      <Box height="100%">
        <Header title="Matches" />
        {content}
      </Box>
    </Motion>
  )
}

export default MatchList
