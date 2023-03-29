import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { MATCHES, LOGIN } from '../routes/routeSpecs'
import * as userService from '../services/user'
import { setToken } from '../utils/api'
import { useAuth } from '@/core/AuthContext'
import { useRouter } from 'next/router'

export const useUser = () => {
  const userQuery = useQuery('user', userService.getUser, {
    staleTime: Infinity,
  })

  return userQuery
}

export const useUserCreation = () => {
  const router = useRouter()

  return useMutation('createUser', userService.createUser, {
    onSuccess: () => {
      router.push(LOGIN)
    },
  })
}

export const useUserAuthenticator = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setIsLoggedIn } = useAuth()

  return useMutation('authUser', userService.authenticateUser, {
    onSuccess: (data) => {
      queryClient.setQueryData(
        'user',
        data?.user !== undefined ? data.user : null
      )

      router.push(MATCHES)
      setToken(data?.token !== undefined ? data.token : null)
      setIsLoggedIn(true)
    },
  })
}
