import { AxiosError } from 'axios'
import { t } from '@lingui/macro'
import { axios } from '../utils/axios'
import { User } from '../types/User'

export const createUser = (
  createUserPayload: Omit<User, 'id' | 'token'> & {
    anonFriendInviteToken?: string
  }
) =>
  axios
    .post<User>(`/me`, createUserPayload)
    .then((response) => response.data)
    .catch((err: AxiosError) => {
      if (err.response?.status === 401) {
        throw new Error(t`Incorrect user format`)
      }
      if (err.response?.status === 409) {
        throw new Error(t`User already exists with given email`)
      }
      if (err.response?.status !== 200) {
        throw new Error(t`An error occurred`)
      }
    })

export const authenticateUser = (loginPayload: {
  email: string
  password: string
}) =>
  axios
    .post<{ user: User; token: string }>(`/auth`, loginPayload)
    .then((response) => response.data)
    .catch((err: AxiosError) => {
      if (err.response?.status === 401) {
        throw new Error(t`Provided credentials doesn't match any valid user`)
      }
      if (err.response?.status !== 200) {
        throw new Error(t`An error occurred`)
      }
    })

export const getUser = () =>
  axios.get<User>(`/me`).then((response) => response.data)
