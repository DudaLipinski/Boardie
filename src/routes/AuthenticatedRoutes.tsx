import { Routes, Route } from 'react-router-dom'
import { MatchItem } from '../pages/Match/MatchItem'
import { Profile } from '../pages/Profile/Profile'
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { MatchList } from '../pages/MatchList/MatchList'

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
