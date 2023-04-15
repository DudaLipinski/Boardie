import axios from 'axios'
import type { UserDTO } from '../../schemas/user'
import { userDTOSchema } from '../../schemas/user'
import * as userMocks from '../../schemas/mocks/user'
import { getAuthConfig, SERVER_URL } from '../../utils/testing'
import { createUser } from '../mocks/user'

describe('POST /me', () => {
  it('creates the user properly', async () => {
    const userData = userMocks.getCreationData()
    const {
      data: { id: userId, ...user },
    } = await axios.post<UserDTO>(`${SERVER_URL}/me`, userData)

    expect(userData).toMatchObject(user)
    expect(userDTOSchema.parse({ id: userId, ...user })).toBeTruthy()
  })
})

describe('GET /me', () => {
  it('gets the user properly', async () => {
    const { password, ...userData } = userMocks.getCreationData()
    const {
      data: { id: userId },
    } = await createUser({ password, ...userData })

    const { data: userDTO } = await axios.get<UserDTO>(
      `${SERVER_URL}/me`,
      getAuthConfig(userId)
    )

    expect(userDTO).toMatchObject({ id: userId, ...userData })
    expect(userDTOSchema.parse(userDTO)).toBeTruthy()
  })
})
