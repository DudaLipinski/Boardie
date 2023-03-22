import { axios } from '../utils/axios'
import { User } from '../types/User'

export const createUser = (createUserPayload: Omit<User, 'id' | 'token'>) =>
  axios
    .post<User>(`/me`, createUserPayload)
    .then((response) => response.data)
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

export const authenticateUser = (loginPayload: {
  email: string
  password: string
}) =>
  axios
    .post<{ user: User; token: string }>(`/auth`, loginPayload)
    .then((response) => response.data)
    .catch((err) => {
      if (err.status === 401) {
        throw new Error("Provided credentials doesn't match any valid user")
      }
      if (err.status !== 200) {
        throw new Error('An error occurred')
      }
    })

export const getUser = () =>
  axios.get<User>(`/me`).then((response) => response.data)
