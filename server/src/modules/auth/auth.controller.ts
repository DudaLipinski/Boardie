import type z from 'zod'
import * as userModel from '../users/users.model'
import { endpoint } from '../../utils/endpoint.utils'
import { generateAccessToken } from './auth.utils'
import { authSchema, authDTOSchema } from './auth.schema'

const auth = endpoint.POST('/auth')<
  void,
  z.infer<typeof authDTOSchema>,
  z.infer<typeof authSchema>,
  void
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
    body: authDTOSchema,
    security: [],
    responses: {
      200: {
        description: 'The authenticated user',
        schema: authSchema,
      },
      401: {
        description: "Provided credentials doesn't match any valid user",
      },
    },
  }
)

export const endpoints = {
  auth,
}
