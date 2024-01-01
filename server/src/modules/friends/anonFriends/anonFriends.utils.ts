import jwt from 'jsonwebtoken'
import { JWT_ANON_FRIEND_INVITE_SECRET_KEY } from '../../../constants'

export type AnonFriendInviteTokenPayload = {
  userId: number
  anonFriendId: number
}
export function generateInviteToken(
  tokenPayload: AnonFriendInviteTokenPayload
) {
  const jwtInviteSecretKey = process.env[JWT_ANON_FRIEND_INVITE_SECRET_KEY]
  if (!jwtInviteSecretKey) {
    throw new Error('No JWT_ANON_FRIEND_INVITE_SECRET_KEY found')
  }

  return jwt.sign(tokenPayload, jwtInviteSecretKey, {
    expiresIn: '2d',
  })
}

export function verifyInviteToken(token: string) {
  const jwtInviteSecretKey = process.env[JWT_ANON_FRIEND_INVITE_SECRET_KEY]
  if (!jwtInviteSecretKey) {
    throw new Error('No JWT_ANON_FRIEND_INVITE_SECRET_KEY found')
  }

  try {
    return jwt.verify(token, jwtInviteSecretKey) as AnonFriendInviteTokenPayload
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return 'expired'
    }

    return null
  }
}
