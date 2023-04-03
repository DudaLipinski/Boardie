import omit from 'lodash.omit'
import { axios } from '../utils/axios'
import { Match, Participant } from '../types/Match'
import { catchInternalError } from '../utils/api'

interface matchDetails extends Omit<Match, 'authorId' | 'participants' | 'id'> {
  id?: number
}

interface participantDetails extends Participant {
  matchId: number
}

const genericError =
  'We were unable to perfom this action. Try again in a few minutes.'

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
        throw new Error(genericError)
      }
    })

export const updateMatchDetails = (matchPayload: matchDetails): Promise<void> =>
  axios({
    method: 'put',
    url: `/matches/${matchPayload.id}`,
    data: omit(matchPayload, 'id'),
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)
      if (err.status === 403) {
        throw new Error(
          "You don't have the needed permissions to update this match."
        )
      }

      if (err.status === 404) {
        throw new Error('We were unable to find the match with the given ID.')
      }

      if (err.status !== 200) {
        throw new Error(genericError)
      }
    })

export const createMatchParticipant = (participant: participantDetails) =>
  axios({
    method: 'post',
    url: `/matches/${participant.matchId}/participants`,
    data: omit(participant, 'matchId'),
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)

      if (err.status === 403) {
        throw new Error(
          "You don't have the needed permissions to update this match."
        )
      }

      if (err.status === 404) {
        throw new Error('We were unable to find the match with the given ID.')
      }

      if (err.status !== 200) {
        throw new Error(genericError)
      }
    })

export const deleteMatchParticipant = ({
  matchId,
  participantId,
}: {
  matchId: number
  participantId: number
}): Promise<void> =>
  axios({
    method: 'delete',
    url: `/matches/${matchId}/participants/${participantId}`,
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
        throw new Error('We were unable to find the match or the participant.')
      }

      if (err.status !== 200) {
        throw new Error(genericError)
      }
    })

export const updateMatchParticipant = (
  participant: participantDetails
): Promise<void> =>
  axios({
    method: 'put',
    url: `/matches/${participant.matchId}/participants/${participant.id}`,
    data: omit(participant, 'id', 'matchId'),
  })
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      catchInternalError(err)

      if (err.status === 403) {
        throw new Error(
          "You don't have the needed permissions to update this match."
        )
      }

      if (err.status === 404) {
        throw new Error('We were unable to find the match or the participant.')
      }

      if (err.status !== 200) {
        throw new Error(genericError)
      }
    })
