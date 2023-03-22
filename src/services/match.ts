import { axios } from '../utils/axios'
import { Match } from '../types/Match'
import { catchInternalError } from '../utils/api'

export const createMatch = (matchPayload: Omit<Match, 'id' | 'authorId'>) =>
  axios({
    method: 'post',
    url: `/me/matches`,
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
    url: `/me/matches`,
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

export const getMatch = (matchId: number): Promise<Match> =>
  axios({
    method: 'get',
    url: `/matches/${matchId}`,
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)

      if (err.status === 404) {
        throw new Error('We were unable to find the match with the given ID.')
      }
      if (err.status !== 200) {
        throw new Error(
          'We were unable to fetch the match. Try again in a few minutes.'
        )
      }
    })

export const deleteMatch = (matchId: number): Promise<void> =>
  axios({
    method: 'delete',
    url: `/matches/${matchId}`,
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)

      if (err.status === 403) {
        throw new Error(
          "You don't have the needed permissions to delete this match."
        )
      }
      if (err.status === 404) {
        throw new Error('We were unable to find the match with the given ID.')
      }
      if (err.status !== 200) {
        throw new Error(
          'We were unable to delete the match. Try again in a few minutes.'
        )
      }
    })
