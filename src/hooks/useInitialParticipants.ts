import { useSelector } from 'react-redux'
import { selectors as userSelectors } from '../state/user'

export const useInitialParticipants = () => {
  const author = useSelector(userSelectors.getUser)

  return [
    {
      score: 0,
      isWinner: false,
      friend: {
        id: +author.id,
        fullName: `${author.firstName} ${author.middleAndSurname}`,
        type: 'USER',
      },
    },
    {
      score: 0,
      isWinner: false,
      friend: {
        id: 0,
        fullName: '',
        type: '',
      },
    },
  ]
}
