import { Match } from '../../types/Match'
import { Link } from 'react-router-dom'

import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'
import { ListItem, IconButton, Box } from '@mui/material'
import { Avatars } from './Avatars'
import { MatchInfo } from './MatchInfo'
import { styledListItem } from './MatchCard.styles'

export const MatchCard = ({ match }: { match: Match }) => {
  const { id, boardgameName, date, duration, participants } = match

  return (
    <Link to={`/matches/${id}`} style={{ textDecoration: 'none' }}>
      <ListItem sx={{ ...styledListItem }}>
        <Box width="90%" paddingTop="6px">
          <MatchInfo
            boardgameName={boardgameName}
            date={date}
            duration={duration}
          />
          <Avatars participants={participants} />
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
