import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as matchesService from '../services/match'
import { Match } from '../types/Match'
import { useOptimisticUpdate } from '../utils/queries'

const MATCHES_KEY = 'matches'
export const useMatches = () => {
  const matchesQuery = useQuery(MATCHES_KEY, matchesService.getMatches, {
    staleTime: 120 * 100,
  })

  return matchesQuery
}

const MATCH_KEY = 'match'
export const useMatch = (matchId: number) => {
  const matchQuery = useQuery([MATCH_KEY, matchId], () =>
    matchesService.getMatch(matchId)
  )

  return matchQuery
}

const CREATE_MATCH_KEY = 'createMatch'
export const useMatchCreation = () => {
  const queryClient = useQueryClient()

  return useMutation(CREATE_MATCH_KEY, matchesService.createMatch, {
    onSettled: () => {
      queryClient.invalidateQueries(MATCHES_KEY)
    },
  })
}

const DELETE_MATCH_KEY = 'deleteMatch'
export const useMatchDeletion = () => {
  const filterDeletedMatch = useOptimisticUpdate(
    MATCHES_KEY,
    (deletedMatchId: number) => (oldMatches: Match[] | undefined) =>
      oldMatches ? oldMatches.filter(({ id }) => id !== deletedMatchId) : []
  )

  return useMutation(
    DELETE_MATCH_KEY,
    matchesService.deleteMatch,
    filterDeletedMatch
  )
}

const UPDATE_MATCH_KEY = 'updateMatchDetails'
export const useMatchUpdate = () => {
  return useMutation(UPDATE_MATCH_KEY, matchesService.updateMatchDetails)
}

const CREATE_MATCH_PARTICIPANT_KEY = 'createMatchParticipant'
export const useMatchParticipantCreation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    CREATE_MATCH_PARTICIPANT_KEY,
    matchesService.createMatchParticipant,
    {
      onSettled: () => {
        queryClient.invalidateQueries(MATCH_KEY)
      },
    }
  )
}

const DELETE_MATCH_PARTICIPANT_KEY = 'deleteMatch'
export const useMatchParticipantDeletion = () => {
  return useMutation(
    DELETE_MATCH_PARTICIPANT_KEY,
    matchesService.deleteMatchParticipant
  )
}

const UPDATE_MATCH_PARTICIPANT_KEY = 'updateMatchParticipants'
export const useMatchUpdateParticipant = () => {
  return useMutation(
    UPDATE_MATCH_PARTICIPANT_KEY,
    matchesService.updateMatchParticipant
  )
}
