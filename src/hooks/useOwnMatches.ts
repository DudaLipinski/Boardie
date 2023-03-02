/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { getMatches } from '../services/match'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as userSelectors,
  actions as userActions,
} from '../state/user'

export const useOwnMatches = () => {
  const dispatch = useDispatch()
  const matches = useSelector(userSelectors.getUserMatches)

  const loadMatches = async () => {
    const loadedMatches = await getMatches()
    dispatch(userActions.setMatches(loadedMatches))
  }

  useEffect(() => {
    loadMatches()
  }, [])

  return matches
}
