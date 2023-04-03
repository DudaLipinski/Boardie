import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const animationProps = {
  initial: { opacity: 0 },
  transition: { delay: 0.1 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const Motion = ({
  children,
  style,
}: {
  children: ReactNode
  style?: React.CSSProperties
}) => {
  return (
    <motion.div {...animationProps} style={style}>
      {children}
    </motion.div>
  )
}
