import { Match } from '../../types/Match'
import { Link } from 'react-router-dom'

import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'
import { ListItem, IconButton, Box } from '@mui/material'
import { Participants } from './Participants'
import { MatchInfo } from './MatchInfo'
import { styledListItem } from './MatchCard.styles'
import { MATCH_DETAILS } from '../../routes/routeSpecs'

export const MatchCard = ({ match }: { match: Match }) => {
  const { id, boardgameName, participants } = match

  return (
    <Link
      to={`${MATCH_DETAILS.replace(':id', id)}`}
      style={{ textDecoration: 'none' }}
    >
      <ListItem sx={{ ...styledListItem }}>
        <Box width="90%" paddingTop="6px">
          <MatchInfo boardgameName={boardgameName} date={''} duration={10} />
          <Participants participants={participants} />
        </Box>
        <Box width="10%" paddingLeft="10px">
          <IconButton>
            <ArrowForwardIosRoundedIcon />
          </IconButton>
        </Box>
      </ListItem>
    </Link>
  )
}
