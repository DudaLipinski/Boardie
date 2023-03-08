import axios from 'axios'
import { Friend } from '../types/Friend'

export const createAnonymous = (friend: Pick<Friend, 'fullName'>) =>
  axios({
    method: 'post',
    url: 'http://localhost:3007/me/anonfriends',
    data: friend,
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      if (err.status === 400) {
        throw new Error(err.getErrorMessage)
      }
      if (err.status === 401) {
        throw new Error(err.getErrorMessage)
      }
      if (err.status !== 200) {
        throw new Error('An error occurred')
      }
    })

export const getFriends = (): Promise<Omit<Friend, 'score' | 'isWinner'>[]> =>
  axios({
    method: 'get',
    url: `http://localhost:3007/me/friends`,
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      if (err.status === 400) {
        throw new Error(err.getErrorMessage)
      }
      if (err.status === 401) {
        throw new Error(err.getErrorMessage)
      }
      if (err.status !== 200) {
        throw new Error('An error occurred')
      }
    })
