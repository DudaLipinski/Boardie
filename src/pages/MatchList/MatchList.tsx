import { useNavigate } from 'react-router-dom'
import { Match } from '../../types/Match'
import { useOwnMatches } from '../../hooks/useOwnMatches'

import { motion } from 'framer-motion'

import { Fab, List } from '@mui/material'
import { MatchCard } from '../../components/MatchCard/MatchCard'
import AddIcon from '@mui/icons-material/Add'
import { animationProps } from '../../styles/animation'
import { styledFloatButton } from '../../styles/floatingButton'

export const MatchList = () => {
  const navigate = useNavigate()
  const loadedMatches = useOwnMatches()

  const matchItems = loadedMatches?.map((match: Match) => {
    return <MatchCard key={match.id} match={match} />
  })

  return (
    <motion.div
      {...animationProps}
      style={{ width: '100%', position: 'relative' }}
    >
      <List sx={{ width: 'inherit' }}>{matchItems}</List>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ ...styledFloatButton }}
        onClick={() => navigate('/create-match')}
      >
        <AddIcon />
      </Fab>
    </motion.div>
  )
}
