import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_TOKEN_SECRET_KEY } from './constants'

export function generateAccessToken(userId: string | number) {
  if (!process.env[JWT_TOKEN_SECRET_KEY]) {
    throw new Error('No JWT_TOKEN_SECRET found')
  }

  return jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: '7d',
  })
}

export const authenticateToken: RequestHandler = (req, res, next) => {
  if (
    req.path === '/auth' ||
    (req.path === '/user' && req.method === 'POST') ||
    (req.path === '/me' && req.method === 'POST')
  ) {
    return next()
  }

  const authHeader = req.headers['authorization']
  const token = authHeader && (authHeader as string).split(' ')[1]

  if (token == null) {
    return res.sendStatus(401)
  }

  jwt.verify(
    token,
    process.env[JWT_TOKEN_SECRET_KEY] as string,
    (err: any, payload: any) => {
      if (err) {
        console.error(err)
        return res.sendStatus(403)
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.userId = payload.userId

      next()
    }
  )
}
