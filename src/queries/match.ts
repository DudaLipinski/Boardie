import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as matchesService from '../services/match'
import { Match } from '../types/Match'

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
  const queryClient = useQueryClient()

  return useMutation(DELETE_MATCH_KEY, matchesService.deleteMatch, {
    onMutate: async (deletedMatchId) => {
      await queryClient.cancelQueries({ queryKey: [MATCHES_KEY] })

      const previousMatches: Match[] | undefined =
        queryClient.getQueryData(MATCHES_KEY)

      queryClient.setQueryData(MATCHES_KEY, (oldMatches: Match[] | undefined) =>
        oldMatches ? oldMatches.filter(({ id }) => id !== deletedMatchId) : []
      )

      return { previousMatches }
    },
    onError: (err, deletedMatchId, context) => {
      queryClient.setQueryData(['todos'], context?.previousMatches)
    },
  })
}
