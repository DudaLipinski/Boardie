import { useLocation, Routes, Route } from 'react-router-dom'
import { Signup } from '../pages/Signup/Signup'
import { Login } from '../pages/Login/Login'
import { SIGNUP, LOGIN } from './routeSpecs'

export const UnauthenticatedRoutes = () => {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path={LOGIN} element={<Login />} />
      <Route path={SIGNUP} element={<Signup />} />
      <Route path="*" element={<Login />} />
    </Routes>
  )
}
