import { Match } from '../../types/Match'
import { useOwnMatches } from '../../hooks/useOwnMatches'

import { motion } from 'framer-motion'

import { List } from '@mui/material'
import { MatchItem } from '../../components/MatchItem/MatchItem'

export const MatchList = () => {
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
    </motion.div>
  )
}
