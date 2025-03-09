import Cookies from 'js-cookie'
import { axios } from './axios'

export const genericError =
  'We were unable to perfom this action. Try again in a few minutes.'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const catchInternalError = (err: any) => {
  if (err.status === 500) {
    throw new Error('Unexpected internal error')
  }
}

export const getErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'An error ocurred'

  return message
}

export const setTokenOnCookies = (token?: string | null) => {
  if (!token) {
    Cookies.remove('token')
  } else {
    Cookies.set('token', token, {
      secure: true,
      sameSite: 'strict',
      expires: 30,
    })
  }
}
export const getTokenFromCookies = () => Cookies.get('token')

export const setAxiosAuthorizationHeader = (token?: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

export const setToken = (token?: string | null) => {
  setTokenOnCookies(token)
  setAxiosAuthorizationHeader(token)
}

export const setUnauthorizedHandler = (handler: () => void) => {
  const unauthorizedInterceptor = axios.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response.status === 401) {
        handler()
      }
      return Promise.reject(error)
    },
  )

  return () => axios.interceptors.response.eject(unauthorizedInterceptor)
}

export const setAxiosTokenFromCookies = () =>
  setAxiosAuthorizationHeader(getTokenFromCookies())

setAxiosTokenFromCookies()
