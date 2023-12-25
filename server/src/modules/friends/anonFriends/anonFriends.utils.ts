import jwt from 'jsonwebtoken'
import { JWT_ANON_FRIEND_INVITE_SECRET_KEY } from '../../../constants'

type AnonFriendInviteTokenPayload = {
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
    expiresIn: '30m',
  })
}

export function verifyInviteToken(token: string) {
  const jwtInviteSecretKey = process.env[JWT_ANON_FRIEND_INVITE_SECRET_KEY]
  if (!jwtInviteSecretKey) {
    throw new Error('No JWT_ANON_FRIEND_INVITE_SECRET_KEY found')
  }

  try {
    const payload = jwt.verify(
      token,
      jwtInviteSecretKey
    ) as AnonFriendInviteTokenPayload
    return payload
  } catch (err) {
    return null
  }
}
