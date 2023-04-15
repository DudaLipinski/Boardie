import { generateAccessToken } from './auth'

export const SERVER_URL = 'http://localhost:3007'

export const getAuthConfig = (userId: number) => ({
  headers: {
    Authorization: `Bearer ${generateAccessToken(userId)}`,
  },
})
