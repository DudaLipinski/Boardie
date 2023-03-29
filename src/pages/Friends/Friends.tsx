import { motion } from 'framer-motion'
import { Typography } from '@mui/material'
import { animationProps } from '../../styles/animation'

export const Friends = () => {
  return (
    <motion.div
      {...animationProps}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
      }}
    >
      <Typography align="center" variant="body2" component="p" marginTop="8px">
        Friends coming soon
      </Typography>
    </motion.div>
  )
}
