import axios from 'axios'
import type { AnonFriendDTO } from '../anonFriends.schema'
import { getAuthConfig, SERVER_URL } from '../../../../utils/testing.utils'
import * as anonFriendMocks from './anonFriends.schema.mocks'

const createAnonFriend = async (userId: number) => {
  const anonFriendData = anonFriendMocks.getCreationData()
  const { data: anonFriend } = await axios.post<AnonFriendDTO>(
    `${SERVER_URL}/me/anonfriends`,
    anonFriendData,
    getAuthConfig(userId),
  )

  return anonFriend
}

export const anonFriendsControllerMocks = {
  createAnonFriend,
}
