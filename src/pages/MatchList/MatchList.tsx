import { List, Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useMemo } from 'react'
import { useMatches } from '../../queries/match'
import { Match } from '../../types/Match'
import { getErrorMessage } from '../../utils/api'

import { MatchCard } from '../../components/MatchCard/MatchCard'
import { Alert } from '../../components/Alert'
import { Motion } from '../../components/Motion'
import { Title } from '../../components/Title'

export const MatchList = () => {
  const { data: matches, isError, error, isLoading } = useMatches()

  const matchesCards = useMemo(
    () =>
      matches?.map((match: Match) => {
        return <MatchCard key={match.id} match={match} />
      }),
    [matches]
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
    [matches?.length, matchesCards]
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
      <Box height="100%" overflow="auto">
        <Title title="Matches" />
        {content}
      </Box>
    </Motion>
  )
}
