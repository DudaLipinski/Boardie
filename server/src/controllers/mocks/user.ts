import axios from 'axios'
import type { UserCreationData, UserDTO } from '../../schemas/user'
import { getAuthConfig, SERVER_URL } from '../../utils/testing'
import * as userMocks from '../../schemas/mocks/user'

export const createUser = async (creationDataParam?: UserCreationData) => {
  const creationData = creationDataParam ?? userMocks.getCreationData()
  const { data } = await axios.post<UserDTO>(`${SERVER_URL}/me`, creationData)

  return {
    data,
    auth: getAuthConfig(data.id),
  }
}
