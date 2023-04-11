import { axios } from '../utils/axios'
import { GenericUser } from '../types/GenericUser'
import { FriendshipRequest } from '../types/Friend'
import { genericError } from '../utils/api'

export const createAnonymous = (fullName: string) =>
  axios<GenericUser>({
    method: 'post',
    url: `/me/anonfriends`,
    data: { fullName },
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

export const getFriends = (): Promise<GenericUser[]> =>
  axios({
    method: 'get',
    url: `/me/friends`,
  }).then((response) => {
    return response.data
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
