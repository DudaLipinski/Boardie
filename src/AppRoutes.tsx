import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
// import { authUser } from './services/user.ts'

// import { useDispatch } from 'react-redux'
// import { actions as userActions } from './state/user'
import { useSelector } from 'react-redux'
import { selectors as userSelectors } from './state/user'

import { MenuLayoutWrapper } from './components/Menu/MenuLayoutWrapper'
import { Login } from './pages/Login/Login'
import { CreateAccount } from './pages/CreateAccount/CreateAccount'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { Profile } from './pages/Profile'
import { FirstPlayer } from './pages/FirstPlayer/FirstPlayer'
import { MatchItem } from './pages/Match/MatchItem'
import { MatchList } from './pages/Match/MatchList'
import { AnimatePresence } from 'framer-motion'

const AuthenticatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence>
      <MenuLayoutWrapper>
        <Routes location={location} key={location.pathname}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/matches" element={<MatchList />} />
          <Route path="/match" element={<MatchItem />} />
          <Route path="/matches/:matchId" element={<MatchItem />} />
          <Route path="/first-player" element={<FirstPlayer />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </MenuLayoutWrapper>
    </AnimatePresence>
  )
}

const UnauthenticatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </AnimatePresence>
  )
}

const AppRoutes = () => {
  // const dispatch = useDispatch()
  const isLoggedIn = useSelector(userSelectors.getIsLoggedIn)

  useEffect(() => {
    // const loggedInUser = localStorage.getItem('token')
    //todo: getUser by token to maintain login
  }, [])

  return isLoggedIn ? (
    <div
      style={{
        width: '100%',
        height: '100vh',
        margin: 'auto',
        backgroundColor: '#1C1B1E',
      }}
    >
      <AuthenticatedRoutes />
    </div>
  ) : (
    <div
      style={{
        width: '100%',
        height: '100vh',
        margin: 'auto',
        backgroundColor: '#1C1B1E',
      }}
    >
      <UnauthenticatedRoutes />
    </div>
  )
}

export default AppRoutes
