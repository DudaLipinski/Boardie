import { Routes, Route } from 'react-router-dom'
import { MatchCreation } from '../pages/MatchCreation/MatchCreation'
import { Profile } from '../pages/Profile/Profile'
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { MatchList } from '../pages/MatchList/MatchList'
import { MatchEdition } from '../pages/MatchEdition/EditMatch'
import {
  CREATE_MATCH,
  DASHBOARD,
  MATCHES,
  PROFILE,
  MATCH_DETAILS,
  EDIT_MATCH,
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
      <Route path="*" element={<Dashboard />} />
    </Routes>
  )
}
