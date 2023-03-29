import { useQueryClient } from 'react-query'
import { setToken } from '../utils/api'
import { useAuth } from '../core/AuthContext'
import { LOGIN } from './routeSpecs'
import { useRouter } from 'next/router'

export const useLogout = () => {
  const router = useRouter()

  const queryClient = useQueryClient()
  const { setIsLoggedIn } = useAuth()

  return () => {
    queryClient.invalidateQueries()
    setToken(null)
    setIsLoggedIn(false)
    router.push(LOGIN)
  }
}
