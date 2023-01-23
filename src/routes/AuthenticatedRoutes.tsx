import { Routes, Route } from 'react-router-dom'
import { MatchList } from '../pages/Match/MatchList'
import { MatchItem } from '../pages/Match/MatchItem'
import { Profile } from '../pages/Profile/Profile'
import { Dashboard } from '../pages/Dashboard/Dashboard'

export const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/matches" element={<MatchList />} />
      <Route path="/match" element={<MatchItem />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  )
}
