import axios from 'axios'
import { Match } from '../types/Match'

export const createMatch = (matchPayload: Omit<Match, 'id' | 'authorId'>) =>
  axios({
    method: 'post',
    url: 'http://localhost:3007/me/matches',
    data: matchPayload,
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      if (err.status === 400) {
        throw new Error(err.getErrorMessage)
      }
      if (err.status === 500) {
        throw new Error(err.getErrorMessage)
      }
      if (err.status !== 200) {
        throw new Error('An error occurred')
      }
    })

export const getMatches = (): Promise<Match[]> =>
  axios({
    method: 'get',
    url: `http://localhost:3007/me/matches`,
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      if (err.status === 401) {
        throw new Error(err.getErrorMessage)
      }
      if (err.status === 404) {
        throw new Error(err.getErrorMessage)
      }
      if (err.status !== 200) {
        throw new Error('An error occurred')
      }
    })

export const getMatch = (matchId: string): Promise<Match> =>
  axios({
    method: 'get',
    url: `http://localhost:3007/match/${matchId}`,
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      if (err.status === 401) {
        throw new Error(err.getErrorMessage)
      }
      if (err.status === 404) {
        throw new Error(err.getErrorMessage)
      }
      if (err.status !== 200) {
        throw new Error('An error occurred')
      }
    })
