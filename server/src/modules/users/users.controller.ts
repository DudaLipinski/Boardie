import omit from 'lodash.omit'

import type z from 'zod'
import { endpoint } from '../../utils/endpoint.utils'
import { authDTOSchema } from '../auth/auth.schema'
import * as userModel from './users.model'
import { userCreationDataSchema, userDTOSchema } from './users.schema'

const create = endpoint.POST('/me')<
  void,
  z.infer<typeof userCreationDataSchema>,
  z.infer<typeof userDTOSchema>
>(
  async (req, res) => {
    const user = req.body

    const id = await userModel.create(user)
    if (!id) {
      return res.sendStatus(409)
    }

    res.status(201).send({
      id,
      ...omit(user, 'password'),
    })
  },
  {
    summary: 'Creates a new user',
    tags: ['auth'],
    params: null,
    body: userCreationDataSchema,
    responses: {
      201: {
        description: 'The created user',
        schema: userDTOSchema,
      },
      400: {
        description: 'The user data is invalid',
      },
      409: {
        description: "There's already a user registered with this email",
      },
    },
  }
)

const getLoggedUser = endpoint.GET('/me')<
  void,
  void,
  z.infer<typeof userDTOSchema>
>(
  async (req, res) => {
    const user = await userModel.getById(req.userId)
    if (!user) {
      return res.sendStatus(404)
    }

    res.status(200).send(user)
  },
  {
    summary: 'Gets the logged user',
    tags: ['auth'],
    params: null,
    body: null,
    responses: {
      200: {
        description: 'The logged user',
        schema: userDTOSchema,
      },
      404: {
        description: 'The logged user was not found',
      },
    },
  }
)

/**
 * The ideal solution here would be to send an "unregistering confirmal" email
 * to the user and then complete the operation after that.
 *
 * To do so, we would have to generate a token containing the needed information
 * to identify the user that is trying to be unregistered, and, inside the email,
 * provide a link with the token for the user to confirm the unregistering
 *
 * The front-end will then have to have a specific route to handle that, that
 * will basically call a "confirm unregistering" endpoint passing the token
 */
const unregisterLoggedUser = endpoint.POST('/me/unregister')<
  void,
  z.infer<typeof authDTOSchema>,
  void
>(
  async (req, res) => {
    const unregistered = await userModel.unregister(req.userId, req.body)
    if (!unregistered) {
      return res.sendStatus(401)
    }

    res.sendStatus(200)
  },
  {
    summary: 'Unregisters the logged user',
    tags: ['auth'],
    params: null,
    body: authDTOSchema,
    responses: {
      200: {
        description: 'The logged user was unregistered',
      },
      401: {
        description: 'Invalid credentials',
      },
    },
  }
)

export const endpoints = {
  create,
  getLoggedUser,
  unregisterLoggedUser,
}
