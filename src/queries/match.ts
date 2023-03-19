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

export const useMatchCreation = () => {
  const queryClient = useQueryClient()

  return useMutation('createMatch', matchesService.createMatch, {
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
