import { useNavigate } from 'react-router-dom'
import { Match } from '../../types/Match'
import { useOwnMatches } from '../../hooks/useOwnMatches'

import { motion } from 'framer-motion'

import { List, SpeedDial, SpeedDialIcon } from '@mui/material'
import { MatchCard } from '../../components/MatchCard/MatchCard'
import { animationProps } from '../../styles/animation'

const styledSpeedDial = {
  '& .MuiButtonBase-root': {
    position: 'fixed',
    bottom: '70px',
    width: '45px',
    height: '45px',
  },
  alignItems: 'end',
}

export const MatchList = () => {
  const navigate = useNavigate()
  const loadedMatches = useOwnMatches()

  const matchItems = loadedMatches?.map((match: Match) => {
    return <MatchCard key={match.id} match={match} />
  })

  return (
    <motion.div {...animationProps} style={{ width: '100%' }}>
      <List sx={{ width: 'inherit' }}>{matchItems}</List>
      <SpeedDial
        ariaLabel="Create new match"
        sx={{ ...styledSpeedDial }}
        icon={<SpeedDialIcon />}
        onClick={() => navigate('/create-match')}
      ></SpeedDial>
    </motion.div>
  )
}
