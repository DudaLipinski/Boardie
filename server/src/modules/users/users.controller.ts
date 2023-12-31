import omit from 'lodash.omit'

import z from 'zod'
import { endpoint } from '../../utils/endpoint.utils'
import { authDTOSchema } from '../auth/auth.schema'
import * as friendsModel from '../friends/friends.model'
import * as playersModel from '../matches/players/players.model'
import * as anonfriendsModel from '../friends/anonFriends/anonFriends.model'
import * as anonfriendsUtils from '../friends/anonFriends/anonFriends.utils'
import kysely from '../../database'
import * as userModel from './users.model'
import { userCreationDataSchema, userDTOSchema } from './users.schema'

const createUser = async (user: z.infer<typeof userCreationDataSchema>) => {
  const id = await userModel.create(user)
  if (!id) {
    return { error: 409 }
  }

  return { id }
}

const createUserFromAnonFriend = (
  user: z.infer<typeof userCreationDataSchema>,
  referringUserId: number,
  anonFriendId: number
) =>
  kysely.transaction().execute(async (transaction) => {
    const id = await userModel.create(
      { ...user, referredByUserId: referringUserId },
      transaction
    )
    if (!id) {
      return { error: 409 }
    }

    console.log({ id, referringUserId, anonFriendId })

    await playersModel.transferAllFromAnonFriendToUser(
      { userId: id, anonFriendId },
      transaction
    )
    await Promise.all([
      friendsModel.createFriendship([referringUserId, id], transaction),
      anonfriendsModel.deleteById(anonFriendId, transaction), // This needs to be after transferring the players because deleting the anonFriend will clean up the player's anonFriendId due to the foreign key constraint
    ])

    return { id }
  })

const isErrorResult = (result: unknown): result is { error: number } =>
  typeof result === 'object' && result !== null && 'error' in result

const create = endpoint.POST('/me')<
  void,
  z.infer<typeof userCreationDataSchema> & { anonFriendInviteToken?: string },
  z.infer<typeof userDTOSchema>,
  void
>(
  async (req, res) => {
    const { anonFriendInviteToken, ...user } = req.body

    let anonFriendReferral: { anonFriendId: number; userId: number } | undefined
    if (anonFriendInviteToken) {
      const decodedInviteToken = anonfriendsUtils.verifyInviteToken(
        anonFriendInviteToken
      )
      if (!decodedInviteToken) {
        return res.sendStatus(400)
      }

      anonFriendReferral = decodedInviteToken
    }

    const result = anonFriendReferral
      ? await createUserFromAnonFriend(
          user,
          anonFriendReferral.userId,
          anonFriendReferral.anonFriendId
        )
      : await createUser(user)

    if (isErrorResult(result)) {
      return res.sendStatus(result.error)
    }

    res.status(201).send({
      id: result.id,
      ...omit(user, 'password'),
    })
  },
  {
    summary: 'Creates a new user',
    tags: ['auth'],
    body: userCreationDataSchema.extend({
      anonFriendInviteToken: z.string().optional(),
    }),
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
  z.infer<typeof userDTOSchema>,
  void
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
  void,
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
