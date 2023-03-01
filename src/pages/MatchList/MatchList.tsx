import { Match } from '../../types/Match'
import { useOwnMatches } from '../../hooks/useOwnMatches'

import { motion } from 'framer-motion'

import { List, SpeedDial, SpeedDialIcon } from '@mui/material'
import { MatchItem } from '../../components/MatchItem/MatchItem'
import { useNavigate } from 'react-router-dom'

export const MatchList = () => {
  const navigate = useNavigate()
  const loadedMatches = useOwnMatches()

  const matchItems = loadedMatches?.map((match: Match) => {
    return <MatchItem match={match} />
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ delay: 0.1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ width: '100%' }}
    >
      <List sx={{ width: 'inherit' }}>{matchItems}</List>
      <SpeedDial
        ariaLabel="Create new match"
        sx={{
          '& .MuiButtonBase-root': {
            position: 'fixed',
            bottom: '70px',
            width: '45px',
            height: '45px',
          },
          alignItems: 'end',
        }}
        icon={<SpeedDialIcon />}
        onClick={() => navigate('/create-match')}
      ></SpeedDial>
    </motion.div>
  )
}
