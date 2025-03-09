import { generateAccessToken } from '../modules/auth/auth.utils'

export const SERVER_URL = 'http://localhost:3007'

export const getAuthConfig = (userId: number) => ({
  headers: {
    Authorization: `Bearer ${generateAccessToken(userId)}`,
  },
})
