import type { AnonFriendCreationData } from '../anonFriends.schema'
import { getRandomNumber } from '../../../../utils/schema.mocks.utils'

export const getCreationData = (
  params?: AnonFriendCreationData,
): AnonFriendCreationData => {
  const hash = getRandomNumber()
  return {
    fullName: `Mocked Anon Friend ${hash}`,
    ...params,
  }
}
