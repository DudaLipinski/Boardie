import { useLocation, Routes, Route } from 'react-router-dom'
import { CreateAccount } from '../pages/CreateAccount/CreateAccount'
import { Login } from '../pages/Login/Login'
import { CREATE_ACCOUNT, LOGIN } from './routeSpecs'

export const UnauthenticatedRoutes = () => {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path={LOGIN} element={<Login />} />
      <Route path={CREATE_ACCOUNT} element={<CreateAccount />} />
      <Route path="*" element={<Login />} />
    </Routes>
  )
}
