import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { ListItem, Box } from '@mui/material'
import { Players } from './Players'
import { MatchInfo } from './MatchInfo'
import { MenuButton } from './MenuButton'
import { Match } from '@src/types/Match'
import { getErrorMessage } from '@src/utils/api'
import { useMatchDeletion } from '@src/queries/match'
import { MATCH_DETAILS } from '@src/routes/routeSpecs'

import { styledCard } from '@src/styles/card'
import { Alert } from '@components/Alert'

export const MatchCard = ({ match }: { match: Match }) => {
  const { id, boardgame, players, startedAt } = match
  const { mutate, isError, error, isLoading } = useMatchDeletion()

  const playersByScore = useMemo(
    () =>
      players ? players.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)) : [],
    [players]
  )
  const highestScore = playersByScore?.[0]?.score ?? null

  const handleDeleteMatch = () => {
    mutate(id)
  }

  const message = getErrorMessage(error)

  return (
    <>
      {isError && <Alert severity={'error'} message={message} />}
      <ListItem sx={{ ...styledCard }}>
        <Box width="100%" paddingTop="6px">
          <Link
            to={`${MATCH_DETAILS.replace(':id', id.toString())}`}
            style={{ textDecoration: 'none' }}
          >
            <MatchInfo
              boardgameName={boardgame.title}
              date={startedAt}
              highestScore={highestScore}
            />
            <Players players={playersByScore} />
          </Link>
        </Box>
        <Box width="8%" height="auto">
          <MenuButton
            id={id}
            handleDeleteMatch={handleDeleteMatch}
            isLoading={isLoading}
          />
        </Box>
      </ListItem>
    </>
  )
}
