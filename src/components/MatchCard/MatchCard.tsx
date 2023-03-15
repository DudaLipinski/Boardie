import { Match } from '../../types/Match'
import { Link } from 'react-router-dom'

import { ListItem, Box } from '@mui/material'

import { Participants } from './Participants'
import { MatchInfo } from './MatchInfo'
import { styledListItem } from './MatchCard.styles'
import { MATCH_DETAILS } from '../../routes/routeSpecs'
import { MenuButton } from './MenuButton'
import { useMemo } from 'react'

export const MatchCard = ({ match }: { match: Match }) => {
  const { id, boardgameName, participants, startedAt } = match

  const participantsByScore = useMemo(
    () => participants.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    [participants]
  )

  return (
    <ListItem sx={{ ...styledListItem }}>
      <Box width="92%" paddingTop="6px">
        <Link
          to={`${MATCH_DETAILS.replace(':id', id.toString())}`}
          style={{ textDecoration: 'none' }}
        >
          <MatchInfo
            boardgameName={boardgameName}
            date={startedAt}
            participantByHighestScore={participantsByScore[0]}
          />
          <Participants participants={participantsByScore} />
        </Link>
      </Box>
      <Box width="8%" height="auto">
        <MenuButton id={id} />
      </Box>
    </ListItem>
  )
}
