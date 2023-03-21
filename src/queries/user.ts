import { useQuery } from 'react-query'
import * as userService from '../services/user'

export const useUser = () => {
  const userQuery = useQuery('user', userService.getUser, {
    staleTime: Infinity,
  })

  return userQuery
}
