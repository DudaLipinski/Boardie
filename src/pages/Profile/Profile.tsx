import { useSelector } from 'react-redux'
import { selectors as userSelectors } from '../../state/user'
import { motion } from 'framer-motion'

export const Profile = () => {
  const user = useSelector(userSelectors.getUser)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ delay: 0.1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div data-testid="user-details">
        <p data-testid="user-details__name">
          Name: {user?.firstName} {user?.middleAndSurname}
        </p>
        <p>E-mail: {user?.email}</p>
        <p>Age: {user?.age}</p>
      </div>
    </motion.div>
  )
}
