import type z from 'zod'
import * as userModel from '../models/users'
import { generateAccessToken } from '../utils/auth'
import { endpoint } from '../utils/endpoint'
import { authSchema, authDTOSchema } from '../schemas/auth'

const auth = endpoint.POST('/auth')<
  void,
  z.infer<typeof authDTOSchema>,
  z.infer<typeof authSchema>
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
    body: authDTOSchema,
    responses: {
      200: authSchema,
      401: {
        description: "Provided credentials doesn't match any valid user",
      },
    },
  }
)

export const endpoints = {
  auth,
}
