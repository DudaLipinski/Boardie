import { Link } from 'react-router-dom'
import { ListItem, Box } from '@mui/material'
import { useMemo } from 'react'
import { Match } from '../../types/Match'
import { getErrorMessage } from '../../utils/api'
import { useMatchDeletion } from '../../queries/match'
import { MATCH_DETAILS } from '../../routes/routeSpecs'
import { Alert } from '../Alert'
import { styledCard } from '../../styles/card'
import { Players } from './Players'
import { MatchInfo } from './MatchInfo'
import { MenuButton } from './MenuButton'

export const MatchCard = ({ match }: { match: Match }) => {
  const { id, boardgameName, players, startedAt } = match
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
              boardgameName={boardgameName}
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
