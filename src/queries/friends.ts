import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as friendsService from '../services/friend'
import { handleAxiosError } from './handleAxiosError'

export const useFriends = () => {
  const friendsQuery = useQuery('friends', friendsService.getFriends, {
    staleTime: Infinity,
    onError: handleAxiosError,
  })

  return friendsQuery
}

export const useAnonFriendCreation = () => {
  const queryClient = useQueryClient()

  return useMutation('createAnonFriend', friendsService.createAnonymous, {
    onSettled: () => {
      queryClient.invalidateQueries('friends')
    },
    onError: handleAxiosError,
  })
}
