import { useEffect, useState } from 'react'

export type Subject<P extends unknown[], R> = {
  (this: unknown, ...args: P): R
  subscribe: (observer: (parameters: R) => void) => void
  unsubscribe: (observer: (parameters: R) => void) => void
}

export const createSubject = <P extends unknown[], R>(
  callback: (...args: P) => R
): Subject<P, R> => {
  const observers = new Set<(parameters: R) => void>()

  const call = function (this: unknown, ...args: P) {
    const result = callback.apply(this, args) as R
    observers.forEach((listener) => listener(result))
    return result
  }

  const subscribe = function (observer: (parameters: R) => void) {
    observers.add(observer)
  }

  const unsubscribe = function (observer: (parameters: R) => void) {
    observers.delete(observer)
  }

  call.subscribe = subscribe
  call.unsubscribe = unsubscribe

  return call
}

export const getSubjectValueWatcherHook =
  <Params extends unknown[], Value>(setterSubject: Subject<Params, Value>) =>
  () => {
    const [value, setValue] = useState<Value>()

    useEffect(() => {
      setterSubject.subscribe(setValue)

      return () => {
        setterSubject.unsubscribe(setValue)
      }
    }, [])

    return value
  }
