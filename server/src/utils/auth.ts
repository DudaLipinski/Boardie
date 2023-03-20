import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_TOKEN_SECRET_KEY } from '../constants'

export function generateAccessToken(userId: string | number) {
  if (!process.env[JWT_TOKEN_SECRET_KEY]) {
    throw new Error('No JWT_TOKEN_SECRET found')
  }

  return jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: '1d',
  })
}

const RENEWAL_THRESHOLD = 60 * 60 * 12 // 12 hours
const checkTokenIsAboutToExpire = (token: string) => {
  const { exp: expiresAt } = jwt.decode(token) as { exp: number }
  const now = Date.now() / 1000
  return expiresAt - now < RENEWAL_THRESHOLD
}

const unauthenticatedEndpoints = [
  { path: '/auth', method: 'POST' },
  { path: '/me', method: 'POST' },
]
export const authenticateToken: RequestHandler = (req, res, next) => {
  if (
    unauthenticatedEndpoints.some(
      ({ path, method }) => req.path === path && req.method === method
    )
  ) {
    return next()
  }

  const authHeader = req.headers['authorization']
  const token = authHeader && (authHeader as string).split(' ')[1]
  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(
    token,
    process.env[JWT_TOKEN_SECRET_KEY] as string,
    (err: any, payload: any) => {
      if (err) {
        console.error(err)
        return res.sendStatus(401)
      }

      if (checkTokenIsAboutToExpire(token)) {
        const newToken = generateAccessToken(payload.userId)
        res.set('Authorization', `Bearer ${newToken}`)
      }

      req.userId = payload.userId

      next()
    }
  )
}

export const jwtTokenSchema = {
  description: 'A JWT token',
  type: 'string',
  example:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2NjUyMTc4MCwiZXhwIjoxNjY2NTQzMzgwfQ.MDwMf43KJDUspoelvhst3FrzWdxaFzmowZ80alZERVQ',
} as const
