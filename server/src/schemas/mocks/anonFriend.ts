import type { AnonFriendCreationData } from '../anonFriends'
import { getRandomNumber } from './utils'

export const getCreationData = (
  params?: AnonFriendCreationData
): AnonFriendCreationData => {
  const hash = getRandomNumber()
  return {
    fullName: `Mocked Anon Friend ${hash}`,
    ...params,
  }
}
