import { Routes, Route } from 'react-router-dom'
import MatchCreation from '../pages/MatchCreation'
import Profile from '../pages/Profile'
import Dashboard from '../pages/Dashboard'
import MatchList from '../pages/MatchList'
import MatchEdition from '../pages/MatchEdition'
import Friends from '../pages/Friends'
import FriendsRequests from '../pages/FriendsRequests/FriendsRequests'
import {
  CREATE_MATCH,
  DASHBOARD,
  MATCHES,
  PROFILE,
  MATCH_DETAILS,
  EDIT_MATCH,
  FRIENDS,
  FRIENDSHIP_REQUESTS,
} from './routeSpecs'

export const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path={DASHBOARD} element={<Dashboard />} />
      <Route path={MATCHES} element={<MatchList />} />
      <Route path={MATCH_DETAILS} element={<MatchEdition />} />
      <Route path={CREATE_MATCH} element={<MatchCreation />} />
      <Route path={EDIT_MATCH} element={<MatchEdition />} />
      <Route path={PROFILE} element={<Profile />} />
      <Route path={FRIENDS} element={<Friends />} />
      <Route path={FRIENDSHIP_REQUESTS} element={<FriendsRequests />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  )
}
