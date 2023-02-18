import axios from 'axios'
import { User } from '../types/User'

export const createUser = (createUserPayload: Omit<User, 'id'>) =>
  axios
    .post<User>('http://localhost:3007/me', createUserPayload)
    .then((response) => {
      const token = response.data.token
      localStorage.setItem('token', token)
      setAuthToken(token)

      return response.data
    })
    .catch((err) => {
      if (err.status === 401) {
        throw new Error('Incorrect user format')
      }
      if (err.status === 409) {
        throw new Error('User already exists with given email')
      }
      if (err.status !== 200) {
        throw new Error('An error occurred')
      }
    })

export const authUser = (loginPayload: { email: string; password: string }) =>
  axios
    .post<{ user: User; token: string }>(
      'http://localhost:3007/auth',
      loginPayload
    )
    .then((response) => {
      const token = response.data.token
      localStorage.setItem('token', token)
      setAuthToken(token)

      return response.data
    })
    .catch((err) => {
      if (err.status === 401) {
        throw new Error("Provided credentials doesn't match any valid user")
      }
      if (err.status !== 200) {
        throw new Error('An error occurred')
      }
    })

export const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}
