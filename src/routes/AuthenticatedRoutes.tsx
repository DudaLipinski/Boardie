import { Routes, Route } from 'react-router-dom'
import { Match } from '../pages/Match/Match'
import { Profile } from '../pages/Profile/Profile'
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { MatchList } from '../pages/MatchList/MatchList'

export const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/matches" element={<MatchList />} />
      <Route path="/match/id" element={<Match />} />
      <Route path="/create-match" element={<Match />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  )
}
