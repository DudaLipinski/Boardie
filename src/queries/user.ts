import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../core/AuthContext'
import { MATCHES } from '../routes/routeSpecs'
import * as userService from '../services/user'
import { setToken } from '../utils/api'

export const useUser = () => {
  const userQuery = useQuery('user', userService.getUser, {
    staleTime: Infinity,
  })

  return userQuery
}

export const useUserCreation = () => {
  return useMutation('createUser', userService.createUser, {})
}

export const useUserAuthenticator = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setIsLoggedIn } = useAuth()

  return useMutation('authUser', userService.authenticateUser, {
    onSuccess: (data) => {
      queryClient.setQueryData(
        'user',
        data?.user !== undefined ? data.user : null
      )
      navigate(MATCHES)
      setToken(data?.token !== undefined ? data.token : null)
      setIsLoggedIn(true)
    },
  })
}
