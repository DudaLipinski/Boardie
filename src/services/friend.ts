import { axios } from '../utils/axios'
import { GenericUser } from '../types/GenericUser'
import { SERVER_URL } from '../constants'

export const createAnonymous = (fullName: string) =>
  axios<GenericUser>({
    method: 'post',
    url: `${SERVER_URL}/me/anonfriends`,
    data: { fullName },
  }).then((response) => {
    return response.data
  })

export const getFriends = (): Promise<GenericUser[]> =>
  axios({
    method: 'get',
    url: `${SERVER_URL}/me/friends`,
  }).then((response) => {
    return response.data
  })
