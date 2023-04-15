import axios from 'axios'
import type { Auth } from '../../schemas/auth'
import { userDTOSchema } from '../../schemas/user'
import * as userMocks from '../../schemas/mocks/user'
import { SERVER_URL } from '../../utils/testing'
import { createUser } from '../mocks/user'

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
