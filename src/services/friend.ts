import axios from 'axios'
import { GenericUser } from '../types/GenericUser'
const SERVER_URL = process.env.REACT_APP_SERVER_URL

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
