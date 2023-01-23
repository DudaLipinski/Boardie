import { useEffect } from 'react'
// import { authUser } from './services/user.ts'

// import { useDispatch } from 'react-redux'
// import { actions as userActions } from './state/user'
import { useSelector } from 'react-redux'
import { selectors as userSelectors } from '../state/user'

import { UnauthenticatedRoutes } from './UnauthenticatedRoutes'
import { AuthenticatedWrapper } from './AuthenticatedWrapper'

const AppRoutes = () => {
  // const dispatch = useDispatch()
  const isLoggedIn = useSelector(userSelectors.getIsLoggedIn)

  useEffect(() => {
    // const loggedInUser = localStorage.getItem('token')
    //todo: getUser by token to maintain login
  }, [])

  return isLoggedIn ? <AuthenticatedWrapper /> : <UnauthenticatedRoutes />
}

export default AppRoutes
