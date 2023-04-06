import { axios } from '../utils/axios'
import { GenericUser } from '../types/GenericUser'

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
        throw new Error(
          'We were unable to perform this action. Try again in a few minutes.'
        )
      }
    })

export const getFriends = (): Promise<GenericUser[]> =>
  axios({
    method: 'get',
    url: `/me/friends`,
  }).then((response) => {
    return response.data
  })

export const getFriendshipRequests = (): Promise<Omit<GenericUser, 'type'>[]> =>
  axios({
    method: 'get',
    url: `/me/friends/requests`,
  }).then((response) => {
    return response.data
  })
