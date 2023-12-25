import jwt from 'jsonwebtoken'
import { JWT_ANON_FRIEND_INVITE_SECRET_KEY } from '../../../constants'

export function generateInviteToken(anonFriendId: number) {
  const jwtInviteSecretKey = process.env[JWT_ANON_FRIEND_INVITE_SECRET_KEY]
  if (!jwtInviteSecretKey) {
    throw new Error('No JWT_ANON_FRIEND_INVITE_SECRET_KEY found')
  }

  return jwt.sign({ anonFriendId }, jwtInviteSecretKey, {
    expiresIn: '30m',
  })
}

export function verifyInviteToken(token: string) {
  const jwtInviteSecretKey = process.env[JWT_ANON_FRIEND_INVITE_SECRET_KEY]
  if (!jwtInviteSecretKey) {
    throw new Error('No JWT_ANON_FRIEND_INVITE_SECRET_KEY found')
  }

  return jwt.verify(token, jwtInviteSecretKey)
}
