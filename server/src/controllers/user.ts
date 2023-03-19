import omit from 'lodash.omit'

import type { UserCreationData, UserDTO } from '../schemas/user'
import { userCreationDataSchema, userDTOSchema } from '../schemas/user'
import type { AuthData } from '../schemas/auth'
import { authDataSchema } from '../schemas/auth'
import * as userModel from '../models/user'
import { endpoint } from '../utils/endpoint'

export const create = endpoint.POST('/me')<void, UserCreationData, UserDTO>(
  async (req, res) => {
    const user = req.body

    const userWithSameEmail = await userModel.getByEmail(user.email)
    if (userWithSameEmail) {
      return res.sendStatus(409)
    }

    const id = await userModel.create(user)
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

export const getLoggedUser = endpoint.GET('/me')<void, void, UserDTO>(
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
export const unregisterLoggedUser = endpoint.POST('/me/unregister')<
  void,
  AuthData,
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
    body: authDataSchema,
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
