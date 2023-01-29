import { useLocation, Routes, Route } from 'react-router-dom'
import { CreateAccount } from '../pages/CreateAccount/CreateAccount'
import { Login } from '../pages/Login/Login'

export const UnauthenticatedRoutes = () => {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="*" element={<Login />} />
    </Routes>
  )
}
