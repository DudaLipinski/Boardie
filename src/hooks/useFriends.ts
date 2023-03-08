import { getFriends } from './../services/friend'
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectors as userSelectors,
  actions as userActions,
} from '../state/user'

export const useFriends = () => {
  const dispatch = useDispatch()
  const friends = useSelector(userSelectors.getUserFriends)

  const loadFriends = async () => {
    const loadedFriends = await getFriends()
    dispatch(userActions.setFriends(loadedFriends))
  }

  useEffect(() => {
    loadFriends()
  }, [])

  return friends
}
