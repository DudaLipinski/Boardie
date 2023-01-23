import { useEffect } from 'react'
// import { authUser } from './services/user.ts'

// import { useDispatch } from 'react-redux'
// import { actions as userActions } from './state/user'
import { useSelector } from 'react-redux'
import { selectors as userSelectors } from '../state/user'

import styled from 'styled-components'
import { AuthenticatedRoutes } from './AuthenticatedRoutes'
import { UnauthenticatedRoutes } from './UnauthenticatedRoutes'

const BackgroundWrapper = styled.div`
  width: 100%;
  height: 100vh;
  margin: auto;
  background-color: #1c1b1e;
`

const AppRoutes = () => {
  // const dispatch = useDispatch()
  const isLoggedIn = useSelector(userSelectors.getIsLoggedIn)

  useEffect(() => {
    // const loggedInUser = localStorage.getItem('token')
    //todo: getUser by token to maintain login
  }, [])

  return isLoggedIn ? (
    <BackgroundWrapper>
      <AuthenticatedRoutes />
    </BackgroundWrapper>
  ) : (
    <BackgroundWrapper>
      <UnauthenticatedRoutes />
    </BackgroundWrapper>
  )
}

export default AppRoutes
