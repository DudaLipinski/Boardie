import axios from 'axios'
import { describe, it, expect } from '@jest/globals'
import { userDTOSchema } from '../../users/users.schema'
import * as userMocks from '../../users/__tests__/users.schema.mocks'
import { SERVER_URL } from '../../../utils/testing.utils'
import { createUser } from '../../users/__tests__/users.controller.mocks'
import type { Auth } from '../auth.schema'

describe('POST /auth', () => {
  it('200 - logs in successfully, with a token as return', async () => {
    const userCreationData = userMocks.getCreationData()
    await createUser(userCreationData)

    const {
      data: { user, token },
    } = await axios.post<Auth>(`${SERVER_URL}/auth`, {
      email: userCreationData.email,
      password: userCreationData.password,
    })

    expect(userDTOSchema.parse(user)).toBeTruthy()
    expect(token).toBeTruthy()
  })
})
