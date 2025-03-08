import axios from 'axios'
import { SERVER_URL } from '../../../utils/testing.utils'
import { userControllerMocks } from '../../users/__tests__/users.controller.mocks'

export const createFriendship = async ({
  requestingUser,
  answeringUser,
}: any) => {
  await axios.post(
    `${SERVER_URL}/me/friends/requests`,
    { userEmail: answeringUser.data.email },
    requestingUser.auth,
  )

  await axios.put(
    `${SERVER_URL}/me/friends/requests/${requestingUser.data.id}`,
    { accept: true },
    answeringUser.auth,
  )
}

const createFriendUsers = async () => {
  const userA = await userControllerMocks.createUser()
  const userB = await userControllerMocks.createUser()

  await createFriendship({ requestingUser: userA, answeringUser: userB })

  return { userA, userB }
}

export const friendsControllerMocks = {
  createFriendUsers,
}
