/* eslint-disable react-hooks/exhaustive-deps */
import { Match } from './../types/Match'
import { useEffect } from 'react'
import { getMatches } from '../services/match'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as userSelectors,
  actions as userActions,
} from '../state/user'

export const useOwnMatches = () => {
  const dispatch = useDispatch()
  const matches: Match[] = useSelector(userSelectors.getUserMatches)

  const loadMatches = async () => {
    const loadedMatches: Match[] = await getMatches()
    dispatch(userActions.setMatches(loadedMatches))
  }

  useEffect(() => {
    if (matches) {
      return
    }

    loadMatches()
  }, [matches])

  return matches
}
