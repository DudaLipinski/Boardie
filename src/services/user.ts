import axios from 'axios'
import { User } from '../types/User'
const SERVER_URL = process.env.REACT_APP_SERVER_URL

export const createUser = (createUserPayload: Omit<User, 'id' | 'token'>) =>
  axios
    .post<User>(`${SERVER_URL}/me`, createUserPayload)
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
    .post<{ user: User; token: string }>(`${SERVER_URL}/auth`, loginPayload)
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
