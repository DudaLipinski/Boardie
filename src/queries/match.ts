import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as matchesService from '../services/match'
import { Match } from '../types/Match'
import { useOptimisticUpdate } from '../utils/queries'

export const MATCHES_KEY = 'matches'
export const useMatches = () => {
  const matchesQuery = useQuery(MATCHES_KEY, matchesService.getMatches, {
    staleTime: 120 * 1000,
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

const UPDATE_MATCH_KEY = 'updateMatch'

export const useMatchUpdate = () => {
  const queryClient = useQueryClient()

  return useMutation(UPDATE_MATCH_KEY, matchesService.updateMatch, {
    onSuccess: (updatedMatch, { id }) => {
      queryClient.setQueryData([MATCH_KEY, id], updatedMatch)
      queryClient.setQueryData(MATCHES_KEY, (oldMatches: Match[] | undefined) =>
        oldMatches
          ? oldMatches.map((match) => (match.id === id ? updatedMatch : match))
          : []
      )
    },
  })
}

const CREATE_MATCH_PLAYER_KEY = 'createPlayer'
export const usePlayerCreation = () => {
  const queryClient = useQueryClient()

  return useMutation(CREATE_MATCH_PLAYER_KEY, matchesService.createPlayer, {
    onSettled: () => {
      queryClient.invalidateQueries(MATCH_KEY)
    },
  })
}

const DELETE_MATCH_PLAYER_KEY = 'deleteMatch'
export const usePlayerDeletion = () => {
  return useMutation(DELETE_MATCH_PLAYER_KEY, matchesService.deletePlayer)
}

const UPDATE_MATCH_PLAYER_KEY = 'updatePlayers'
export const useMatchUpdatePlayer = () => {
  return useMutation(UPDATE_MATCH_PLAYER_KEY, matchesService.updatePlayer)
}
