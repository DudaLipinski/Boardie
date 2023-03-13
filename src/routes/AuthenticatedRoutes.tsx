import { Routes, Route } from 'react-router-dom'
import { Match } from '../pages/Match/Match'
import { Profile } from '../pages/Profile/Profile'
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { MatchList } from '../pages/MatchList/MatchList'
import {
  CREATE_MATCH,
  DASHBOARD,
  MATCHES,
  PROFILE,
  MATCH_DETAILS,
} from './routeSpecs'

export const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path={DASHBOARD} element={<Dashboard />} />
      <Route path={MATCHES} element={<MatchList />} />
      <Route path={MATCH_DETAILS} element={<Match />} />
      <Route path={CREATE_MATCH} element={<Match />} />
      <Route path={PROFILE} element={<Profile />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  )
}
