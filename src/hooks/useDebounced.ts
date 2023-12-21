import { useCallback, useDebugValue, useMemo, useRef } from 'react'

import { createSubject, getSubjectValueWatcherHook } from '../utils/subject'

export const useDebounced = <T extends unknown[], R>(
  callback: (...args: T) => R,
  timeout = 500
) => {
  const timeoutId = useRef<NodeJS.Timeout | undefined>()
  const setIsDebouncingSubject = useMemo(
    () => createSubject((isDebouncing: boolean) => isDebouncing),
    []
  )

  const debouncedFn = useCallback(
    (...args: T) => {
      setIsDebouncingSubject(true)

      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }

      timeoutId.current = setTimeout(() => {
        callback(...args)

        setIsDebouncingSubject(false)
      }, timeout)
    },
    [callback, setIsDebouncingSubject, timeout]
  )

  const useIsDebouncing = useMemo(
    () => getSubjectValueWatcherHook(setIsDebouncingSubject),
    // We can't afford to return a different hook for the parent,
    // no matter what. This will probably crash react.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const isDebouncing = useIsDebouncing()

  useDebugValue(isDebouncing ? 'debouncing' : 'not-debouncing')

  return [debouncedFn, useIsDebouncing] as const
}
