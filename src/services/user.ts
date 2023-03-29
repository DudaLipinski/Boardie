import { axios } from '../utils/axios'
import { User } from '../types/User'
import { catchInternalError } from '../utils/api'

export const createUser = (createUserPayload: Omit<User, 'id' | 'token'>) =>
  axios
    .post<User>(`/me`, createUserPayload)
    .then((response) => response.data)
    .catch((err) => {
      catchInternalError(err)
      const { status } = err.response

      if (status === 401) {
        throw new Error('Incorrect user format')
      }

      if (status === 409) {
        throw new Error('User already exists with given email')
      }

      if (status !== 200) {
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
      catchInternalError(err)
      const { status } = err.response

      if (status === 401) {
        throw new Error("Provided credentials doesn't match any valid user")
      }

      if (status !== 200) {
        throw new Error('An error occurred')
      }
    })

export const getUser = () =>
  axios.get<User>(`/me`).then((response) => response.data)
