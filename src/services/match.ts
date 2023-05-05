import omit from 'lodash.omit'
import { axios } from '../utils/axios'
import { Match, Player } from '../types/Match'
import { catchInternalError, genericError } from '../utils/api'

interface MatchDetails extends Omit<Match, 'authorId' | 'players' | 'id'> {
  id?: number
}

interface PlayerDetails extends Player {
  matchId: number
}

const normalizeMatchData = (match: Omit<Match, 'id'> | MatchDetails) => ({
  ...match,
  location: null,
  players: (match as Omit<Match, 'id'>).players
    ? (match as Omit<Match, 'id'>).players.map(
        ({ friend: { fullName, ...friend }, ...player }) => ({
          ...player,
          friend,
        })
      )
    : null,
})

export const createMatch = (matchPayload: Omit<Match, 'id' | 'authorId'>) =>
  axios({
    method: 'post',
    url: `/me/matches`,
    data: normalizeMatchData(matchPayload),
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)

      if (err.response.status !== 200) {
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

      if (err.response.status !== 200) {
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

      if (err.response.status === 404) {
        throw new Error('We were unable to find the match with the given ID.')
      }

      if (err.response.status !== 200) {
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

      if (err.response.status === 403) {
        throw new Error(
          "You don't have the needed permissions to delete this match."
        )
      }

      if (err.response.status === 404) {
        throw new Error('We were unable to find the match with the given ID.')
      }

      if (err.response.status !== 200) {
        throw new Error(genericError)
      }
    })

export const updateMatch = (matchPayload: MatchDetails): Promise<Match> =>
  axios({
    method: 'put',
    url: `/matches/${matchPayload.id}`,
    data: { ...omit(matchPayload, 'id'), location: null },
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)
      if (err.response.status === 403) {
        throw new Error(
          "You don't have the needed permissions to update this match."
        )
      }

      if (err.response.status === 404) {
        throw new Error('We were unable to find the match with the given ID.')
      }

      if (err.response.status !== 200) {
        throw new Error(genericError)
      }
    })

export const createPlayer = (player: PlayerDetails) =>
  axios({
    method: 'post',
    url: `/matches/${player.matchId}/players`,
    data: omit(player, 'matchId'),
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)

      if (err.response.status === 403) {
        throw new Error(
          "You don't have the needed permissions to update this match."
        )
      }

      if (err.response.status === 404) {
        throw new Error('We were unable to find the match with the given ID.')
      }

      if (err.response.status !== 200) {
        throw new Error(genericError)
      }
    })

export const deletePlayer = ({
  matchId,
  playerId,
}: {
  matchId: number
  playerId: number
}): Promise<void> =>
  axios({
    method: 'delete',
    url: `/matches/${matchId}/players/${playerId}`,
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)

      if (err.response.status === 403) {
        throw new Error(
          "You don't have the needed permissions to delete this match."
        )
      }

      if (err.response.status === 404) {
        throw new Error('We were unable to find the match or the player.')
      }

      if (err.response.status !== 200) {
        throw new Error(genericError)
      }
    })

export const updatePlayer = (player: PlayerDetails): Promise<void> =>
  axios({
    method: 'put',
    url: `/matches/${player.matchId}/players/${player.id}`,
    data: omit(player, 'id', 'matchId'),
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)

      if (err.response.status === 403) {
        throw new Error(
          "You don't have the needed permissions to update this match."
        )
      }

      if (err.response.status === 404) {
        throw new Error('We were unable to find the match or the player.')
      }

      if (err.response.status !== 200) {
        throw new Error(genericError)
      }
    })
