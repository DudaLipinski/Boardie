import { useQueryClient } from 'react-query'

/**
 * This hook is used to update the cache after a mutation.
 * The returned function is used to update the cache.
 *
 * @param queryKey The query key to update
 * @param doOptimisticUpdate A function that takes the mutation params and returns another function that takes the previous value of the query and returns the new value.
 * @returns An object with the onMutate and onError functions to pass to the useMutation hook.
 */
export const useOptimisticUpdate = <MutationParams = unknown, T = unknown>(
  queryKey: string | (string | number)[],
  doOptimisticUpdate: (params: MutationParams) => (oldValue: T | undefined) => T
) => {
  const queryClient = useQueryClient()

  return {
    onMutate: async (mutationParams: MutationParams) => {
      await queryClient.cancelQueries({ queryKey })

      const previousValue: T | undefined = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, doOptimisticUpdate(mutationParams))

      return { previousValue }
    },
    onError: (
      _: unknown,
      __: MutationParams,
      context: { previousValue: T | undefined } | undefined
    ) => {
      queryClient.setQueryData(queryKey, context?.previousValue)
    },
  }
}
