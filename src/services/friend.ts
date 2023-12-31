import { axios } from '../utils/axios'
import { GenericUser } from '../types/GenericUser'
import { AnonFriendInviteTokenData, FriendshipRequest } from '../types/Friend'
import { genericError } from '../utils/api'

export const getFriends = (): Promise<GenericUser[]> =>
  axios({
    method: 'get',
    url: `/me/friends`,
  }).then((response) => {
    return response.data
  })

export const createFriendshipRequest = (userEmail: string) =>
  axios({
    method: 'post',
    url: `/me/friends/requests`,
    data: { userEmail },
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      if (err.response.status === 404) {
        throw new Error('User not found.')
      }

      if (err.response.status === 409) {
        throw new Error('You already sent a request for this user.')
      }

      if (err.response.status !== 200) {
        throw new Error(genericError)
      }
    })

export const getFriendshipRequests = (): Promise<FriendshipRequest[]> =>
  axios({
    method: 'get',
    url: `/me/friends/requests`,
  }).then((response) => {
    return response.data
  })

export const answerFriendshipRequest = ({
  requestingUserId,
  accept,
}: {
  requestingUserId: number
  accept: boolean
}): Promise<void> =>
  axios({
    method: 'put',
    url: `/me/friends/requests/${requestingUserId}`,
    data: { accept: accept },
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      if (err.status !== 200) {
        throw new Error(genericError)
      }
    })

export const createAnonFriend = (fullName: string) =>
  axios<GenericUser>({
    method: 'post',
    url: `/me/anonfriends`,
    data: { fullName },
  }).then((response) => {
    return response.data
  })

export const updateAnonFriend = ({
  anonFriendId,
  fullName,
}: {
  anonFriendId: number
  fullName: string
}): Promise<void> =>
  axios({
    method: 'put',
    url: `/me/anonfriends/${anonFriendId}`,
    data: { fullName: fullName },
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      if (err.status !== 200) {
        throw new Error(genericError)
      }
    })

export const deleteAnonFriend = (anonFriendId: number): Promise<void> =>
  axios({
    method: 'delete',
    url: `/me/anonfriends/${anonFriendId}`,
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      if (err.status === 403) {
        throw new Error(
          "You don't have the needed permissions to delete this friend."
        )
      }

      if (err.status === 404) {
        throw new Error('We were unable to find the friend with the given ID.')
      }

      if (err.status !== 200) {
        throw new Error(genericError)
      }
    })

export const createAnonFriendInviteToken = (anonFriendId: number) =>
  axios<{ inviteToken: string }>({
    method: 'post',
    url: `/me/anonfriends/${anonFriendId}/invite`,
  })
    .then((response) => {
      return response.data?.inviteToken
    })
    .catch((err) => {
      if (err.status === 403) {
        throw new Error(
          "You don't have the needed permissions to invite this friend."
        )
      }

      if (err.status === 404) {
        throw new Error('We were unable to find the friend with the given ID.')
      }

      if (err.status !== 200) {
        throw new Error(genericError)
      }
    })

export const verifyAnonFriendInviteToken = (inviteToken: string) =>
  axios<AnonFriendInviteTokenData>({
    method: 'post',
    url: `/anonfriends/invite/verify`,
    data: { inviteToken },
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      if (err.status === 403) {
        throw new Error('Invalid invite token.')
      }

      if (err.status === 404) {
        throw new Error('The user/anon-friend do not exist anymore.')
      }

      if (err.status !== 200) {
        throw new Error(genericError)
      }
    })
