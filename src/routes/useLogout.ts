import { useNavigate } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { setToken } from '../utils/api'
import { useAuth } from '../core/AuthContext'
import { LOGIN } from './routeSpecs'

export const useLogout = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setIsLoggedIn } = useAuth()

  return () => {
    queryClient.invalidateQueries()
    setToken(null)
    setIsLoggedIn(false)
    navigate(LOGIN)
  }
}
