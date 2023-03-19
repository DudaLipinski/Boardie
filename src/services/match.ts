import axios from 'axios'
import { Match } from '../types/Match'
import { SERVER_URL } from '../constants'
import { catchInternalError } from '../utils/api'

export const createMatch = (matchPayload: Omit<Match, 'id' | 'authorId'>) =>
  axios({
    method: 'post',
    url: `${SERVER_URL}/me/matches`,
    data: matchPayload,
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)

      if (err.status !== 200) {
        throw new Error(
          'We were unable to create a match. Try again in a few minutes.'
        )
      }
    })

export const getMatches = (): Promise<Match[]> =>
  axios({
    method: 'get',
    url: `${SERVER_URL}/me/matches`,
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)

      if (err.status !== 200) {
        throw new Error(
          'We were unable to fetch matches. Try again in a few minutes.'
        )
      }
    })

export const getMatch = (matchId: string): Promise<Match> =>
  axios({
    method: 'get',
    url: `${SERVER_URL}/match/${matchId}`,
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)

      if (err.status === 404) {
        throw new Error('We were unable to find a match with the given ID.')
      }
      if (err.status !== 200) {
        throw new Error(
          'We were unable to fetch a match. Try again in a few minutes.'
        )
      }
    })
