import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as friendsService from '../services/friend'
import { MATCHES_KEY } from './match'

const FRIENDS_KEY = 'friends'
export const useFriends = () =>
  useQuery(FRIENDS_KEY, friendsService.getFriends, {
    staleTime: Infinity,
  })

const CREATE_ANON_FRIEND_KEY = 'createAnonFriend'
export const useAnonFriendCreation = () => {
  const queryClient = useQueryClient()

  return useMutation(CREATE_ANON_FRIEND_KEY, friendsService.createAnonFriend, {
    onSettled: () => {
      queryClient.invalidateQueries(FRIENDS_KEY)
    },
  })
}

const FRIENDSHIP_REQUEST_KEY = 'friendshipRequests'
export const useFriendshipRequests = () => {
  const friendsQuery = useQuery(
    FRIENDSHIP_REQUEST_KEY,
    friendsService.getFriendshipRequests,
    {
      staleTime: 1000 * 60 * 3,
    },
  )

  return friendsQuery
}

const CREATE_FRIENDSHIP_REQUEST_KEY = 'createFriendshipRequest'
export const useFriendshipRequestCreation = () => {
  return useMutation(
    CREATE_FRIENDSHIP_REQUEST_KEY,
    friendsService.createFriendshipRequest,
  )
}

const ANSWER_FRIENDSHIP_REQUEST_KEY = 'answerFriendshipRequest'
export const useAnswerFriendshipRequest = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ANSWER_FRIENDSHIP_REQUEST_KEY,
    friendsService.answerFriendshipRequest,

    {
      onSettled: () => {
        queryClient.invalidateQueries(FRIENDS_KEY)
        queryClient.invalidateQueries(FRIENDSHIP_REQUEST_KEY)
      },
    },
  )
}

const UPDATE_ANON_FRIEND = 'updateAnonFriend'
export const useUpdateAnonFriend = () => {
  const queryClient = useQueryClient()

  return useMutation(
    UPDATE_ANON_FRIEND,
    friendsService.updateAnonFriend,

    {
      onSettled: () => {
        queryClient.invalidateQueries(FRIENDS_KEY)
        queryClient.invalidateQueries(MATCHES_KEY)
      },
    },
  )
}

const DELETE_ANON_FRIEND = 'deleteMatch'
export const useDeleteAnonFriend = () => {
  const queryClient = useQueryClient()

  return useMutation(DELETE_ANON_FRIEND, friendsService.deleteAnonFriend, {
    onSettled: () => {
      queryClient.invalidateQueries(FRIENDS_KEY)
      queryClient.invalidateQueries(MATCHES_KEY)
    },
  })
}

const CREATE_ANON_FRIEND_INVITE_TOKEN = 'createAnonFriendInviteToken'
export const useCreateAnonFriendInviteToken = () =>
  useMutation(
    CREATE_ANON_FRIEND_INVITE_TOKEN,
    friendsService.createAnonFriendInviteToken,
  )

const VERIFY_ANON_FRIEND_INVITE_TOKEN = 'verifyAnonFriendInviteToken'
export const useVerifyAnonFriendInviteToken = () =>
  useMutation(
    VERIFY_ANON_FRIEND_INVITE_TOKEN,
    friendsService.verifyAnonFriendInviteToken,
  )
