import * as userModel from '../models/user'
import { generateAccessToken, jwtTokenSchema } from '../utils/auth'
import type { User } from '../models/user'
import { endpoint } from '../utils/endpoint'
import type { AuthData } from '../schemas/auth'
import { userAuthDTO } from '../schemas/auth'
import { userDTO } from '../schemas/user'

const AUTH_ENDPOINT = '/auth'

export const auth = endpoint.POST(AUTH_ENDPOINT)<
  void,
  AuthData,
  {
    user: Omit<User, 'password'>
    token: string
  }
>(
  async (req, res) => {
    const loggedUser = await userModel.auth(req.body)
    if (!loggedUser) {
      return res.sendStatus(401)
    }

    const token = generateAccessToken(loggedUser.id)

    res.status(200).send({
      user: loggedUser,
      token,
    })
  },
  {
    summary: 'Authenticates a user',
    tags: ['auth'],
    params: null,
    body: userAuthDTO,
    responses: {
      200: {
        description:
          "The logged in user's data along with the generated JWT token",
        schema: {
          type: 'object',
          properties: {
            user: userDTO,
            token: jwtTokenSchema,
          },
          required: ['user', 'token'],
        },
      },
      401: {
        description: "Provided credentials doesn't match any valid user",
      },
    },
  }
)
