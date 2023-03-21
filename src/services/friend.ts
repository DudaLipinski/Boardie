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

export const getFriends = (): Promise<GenericUser[]> =>
  axios({
    method: 'get',
    url: `/me/friends`,
  }).then((response) => {
    return response.data
  })
