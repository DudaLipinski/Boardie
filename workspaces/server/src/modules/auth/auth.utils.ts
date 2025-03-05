import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_AUTH_SECRET_KEY } from '../../constants'

export function generateAccessToken(userId: string | number) {
  const jwtAuthSecretKey = process.env[JWT_AUTH_SECRET_KEY]
  if (!jwtAuthSecretKey) {
    throw new Error('No JWT_AUTH_SECRET_KEY found')
  }

  return jwt.sign({ userId }, jwtAuthSecretKey, {
    expiresIn: '1d',
  })
}

const RENEWAL_THRESHOLD = 60 * 60 * 12 // 12 hours
const checkTokenIsAboutToExpire = (token: string) => {
  const { exp: expiresAt } = jwt.decode(token) as { exp: number }
  const now = Date.now() / 1000
  return expiresAt - now < RENEWAL_THRESHOLD
}

// [TODO] automatically generate these from the endpoint definitions
const unauthenticatedEndpoints = [
  { path: '/auth', method: 'POST' },
  { path: '/me', method: 'POST' },
  { path: '/anonfriends/invite/verify', method: 'POST' },
]
export const authenticateToken: RequestHandler = (req, res, next) => {
  if (
    unauthenticatedEndpoints.some(
      ({ path, method }) => req.path === path && req.method === method,
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
    process.env[JWT_AUTH_SECRET_KEY] as string,
    (err, payload) => {
      if (err || !payload || typeof payload === 'string') {
        console.error(err)
        return res.sendStatus(401)
      }

      if (checkTokenIsAboutToExpire(token)) {
        const newToken = generateAccessToken(payload.userId)
        res.set('Authorization', `Bearer ${newToken}`)
      }

      req.userId = payload.userId

      next()
    },
  )
}
