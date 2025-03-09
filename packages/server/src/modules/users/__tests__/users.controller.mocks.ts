import axios from 'axios'
import { getAuthConfig, SERVER_URL } from '../../../utils/testing.utils'
import type { UserCreationData, UserDTO } from '../users.schema'
import * as userMocks from './users.schema.mocks'

export const createUser = async (creationDataParam?: UserCreationData) => {
  const creationData = creationDataParam ?? userMocks.getCreationData()
  const { data } = await axios.post<UserDTO>(`${SERVER_URL}/me`, creationData)

  return {
    data,
    auth: getAuthConfig(data.id),
  }
}

export const userControllerMocks = {
  createUser,
}
