import axios from 'axios'
import { SERVER_URL } from '../../utils/testing.utils'

export const createFriendship = async ({
  requestingUser,
  answeringUser,
}: any) => {
  await axios.post(
    `${SERVER_URL}/me/friends/requests`,
    { userEmail: answeringUser.data.email },
    requestingUser.auth
  )

  await axios.put(
    `${SERVER_URL}/me/friends/requests/${requestingUser.data.id}`,
    { accept: true },
    answeringUser.auth
  )
}
