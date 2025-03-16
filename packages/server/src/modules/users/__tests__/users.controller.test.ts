import axios from 'axios'
import { describe, it, expect } from '@jest/globals'
import type { UserDTO } from '../users.schema'
import { userDTOSchema } from '../users.schema'
import { getAuthConfig, SERVER_URL } from '../../../utils/testing.utils'
import * as userMocks from './users.schema.mocks'
import { createUser } from './users.controller.mocks'

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
      getAuthConfig(userId),
    )

    expect(userDTO).toMatchObject({ id: userId, ...userData })
    expect(userDTOSchema.parse(userDTO)).toBeTruthy()
  })
})
