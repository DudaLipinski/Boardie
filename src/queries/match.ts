import { useMutation, useQuery, useQueryClient } from 'react-query'
import { handleAxiosError } from './handleAxiosError'
import * as matchesService from '../services/match'

export const useMatches = () => {
  const matchesQuery = useQuery('matches', matchesService.getMatches, {
    staleTime: 120 * 100,
    onError: handleAxiosError,
  })

  return matchesQuery
}

export const useMatchCreation = () => {
  const queryClient = useQueryClient()

  return useMutation('createMatch', matchesService.createMatch, {
    onSettled: () => {
      queryClient.invalidateQueries('matches')
    },
    onError: handleAxiosError,
  })
}
