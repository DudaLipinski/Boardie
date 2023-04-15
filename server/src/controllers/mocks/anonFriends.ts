import axios from 'axios'
import * as anonFriendMocks from '../../schemas/mocks/anonFriend'
import type { AnonFriendDTO } from '../../schemas/anonFriends'
import { getAuthConfig, SERVER_URL } from '../../utils/testing'

export const createAnonFriend = async (userId: number) => {
  const anonFriendData = anonFriendMocks.getCreationData()
  const { data: anonFriend } = await axios.post<AnonFriendDTO>(
    `${SERVER_URL}/me/anonfriends`,
    anonFriendData,
    getAuthConfig(userId)
  )

  return anonFriend
}
