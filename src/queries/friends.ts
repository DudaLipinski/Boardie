import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as friendsService from '../services/friend'

const FRIENDS_KEY = 'friends'
export const useFriends = () => {
  const friendsQuery = useQuery(FRIENDS_KEY, friendsService.getFriends, {
    staleTime: Infinity,
  })

  return friendsQuery
}

const CREATE_ANON_FRIEND_KEY = 'createAnonFriend'
export const useAnonFriendCreation = () => {
  const queryClient = useQueryClient()

  return useMutation(CREATE_ANON_FRIEND_KEY, friendsService.createAnonymous, {
    onSettled: () => {
      queryClient.invalidateQueries(FRIENDS_KEY)
    },
  })
}

const CREATE_FRIEND_REQUEST_KEY = 'createFriendRequest'
export const useFriendRequestCreation = () => {
  return useMutation(
    CREATE_FRIEND_REQUEST_KEY,
    friendsService.createFriendRequest
  )
}
