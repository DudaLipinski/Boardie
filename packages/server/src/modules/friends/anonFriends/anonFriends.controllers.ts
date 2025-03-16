import { z } from 'zod'

import { endpoint } from '@boardie/endpoints'
import { FriendType } from '../friends.schema'
import * as usersModel from '../../users/users.model'
import { userNameDTOSchema } from '../../users/users.schema'
import * as anonFriendsModel from './anonFriends.model'
import * as anonFriendsUtils from './anonFriends.utils'
import {
  anonFriendUpdateDataSchema,
  anonFriendCreationDataSchema,
  anonFriendDTOSchema,
} from './anonFriends.schema'

const checkAccess = {
  update: (userId: number, anonFriend: anonFriendsModel.AnonFriend) =>
    anonFriend.userId === userId,
  delete: (userId: number, anonFriend: anonFriendsModel.AnonFriend) =>
    anonFriend.userId === userId,
}

const createForLoggedUser = endpoint.post(
  '/me/anonfriends',
  async (req, res) => {
    const { id } = await anonFriendsModel.create({
      ...req.body,
      userId: req.userId,
    })

    res.status(201).send({
      id,
      fullName: req.body.fullName,
      type: FriendType.ANON_FRIEND,
    })
  },
  {
    summary: 'Creates an anonymous friend for the logged user',
    tags: ['friends'],
    body: anonFriendCreationDataSchema,
    responses: {
      201: {
        description: 'The created anonymous friend',
        schema: anonFriendDTOSchema,
      },
    },
  },
)

// QUESTIONING: the /me prefix might not be necessary here
const generateInviteToken = endpoint.post(
  '/me/anonfriends/:anonFriendId/invite',
  async (req, res) => {
    const anonFriendId = parseInt(req.params.anonFriendId, 10)

    const anonFriend = await anonFriendsModel.getById(anonFriendId)
    if (!anonFriend) {
      return res.sendStatus(404)
    }
    if (!checkAccess.update(req.userId, anonFriend)) {
      return res.sendStatus(403)
    }

    const inviteToken = anonFriendsUtils.generateInviteToken({
      anonFriendId,
      userId: req.userId,
    })
    res.status(200).send({
      inviteToken,
    })
  },
  {
    summary: 'Generates an invite link for an anonymous friend',
    tags: ['friends'],
    pathParams: {
      anonFriendId: {
        type: 'number',
        description: 'The id of the anonymous friend to generate the link for',
      },
    },
    responses: {
      200: {
        description: 'The invite link',
        schema: z.object({
          inviteToken: z.string(),
        }),
      },
      403: {
        description: 'The logged user is not allowed to generate the link',
      },
      404: {
        description: 'The friend does not exist',
      },
    },
  },
)

const verifyInviteToken = endpoint.post(
  '/anonfriends/invite/verify',
  async (req, res) => {
    const { inviteToken } = req.body

    const inviteTokenPayload = anonFriendsUtils.verifyInviteToken(inviteToken)
    if (!inviteTokenPayload) {
      return res.sendStatus(403)
    }
    if (inviteTokenPayload === 'expired') {
      return res.status(403).send({
        message: 'expired',
      })
    }

    const [anonFriend, invitingUser] = await Promise.all([
      anonFriendsModel.getById(inviteTokenPayload.anonFriendId),
      usersModel.getById(inviteTokenPayload.userId),
    ])
    if (!invitingUser || !anonFriend) {
      return res.sendStatus(404)
    }

    res.status(200).send({
      invitingUser: {
        firstName: invitingUser.firstName,
        middleAndSurname: invitingUser.middleAndSurname,
      },
      anonFriendFullName: anonFriend.fullName,
    })
  },
  {
    summary: 'Verifies an anon-friend invite token',
    tags: ['friends'],
    body: z.object({
      inviteToken: z.string(),
    }),
    security: [],
    responses: {
      200: {
        description: 'The token is valid',
        schema: z.object({
          invitingUser: userNameDTOSchema,
          anonFriendFullName: z.string(),
        }),
      },
      403: {
        description: 'The token is invalid',
      },
      404: {
        description:
          'The token is valid but the user/anon-friend do not exist anymore',
      },
    },
  },
)

const update = endpoint.put(
  '/me/anonfriends/:anonFriendId',
  async (req, res) => {
    const anonFriendUpdateData = req.body
    const anonFriendId = parseInt(req.params.anonFriendId, 10)

    const anonFriend = await anonFriendsModel.getById(anonFriendId)
    if (!anonFriend) {
      return res.sendStatus(404)
    }
    if (!checkAccess.update(req.userId, anonFriend)) {
      return res.sendStatus(403)
    }

    await anonFriendsModel.update(anonFriendId, anonFriendUpdateData)
    res.status(200).send({
      id: anonFriendId,
      fullName: anonFriendUpdateData.fullName,
      type: FriendType.ANON_FRIEND,
    })
  },
  {
    summary: 'Updates an anonymous friend for the logged user',
    tags: ['friends'],
    pathParams: {
      anonFriendId: {
        type: 'number',
        description: 'The id of the anonymous friend to update',
      },
    },
    body: anonFriendUpdateDataSchema,
    responses: {
      200: {
        description: 'The updated anonymous friend data',
        schema: anonFriendDTOSchema,
      },
      403: {
        description: 'The logged user is not allowed to update the friend',
      },
      404: {
        description: 'The friend does not exist',
      },
    },
  },
)

const deleteById = endpoint.delete(
  '/me/anonfriends/:anonFriendId',
  async (req, res) => {
    const anonFriendId = parseInt(req.params.anonFriendId, 10)

    const anonFriend = await anonFriendsModel.getById(anonFriendId)
    if (!anonFriend) {
      return res.sendStatus(404)
    }
    if (!checkAccess.delete(req.userId, anonFriend)) {
      return res.sendStatus(403)
    }

    const deleted = await anonFriendsModel.deleteById(anonFriendId)
    if (!deleted) {
      return res.sendStatus(404)
    }

    res.sendStatus(200)
  },
  {
    summary: 'Deletes an anonymous friend for the logged user',
    tags: ['friends'],
    pathParams: {
      anonFriendId: {
        type: 'number',
        description: 'The id of the anonymous friend to delete',
      },
    },
    responses: {
      200: {
        description: 'The anonymous friend was deleted',
      },
      403: {
        description: 'The logged user is not allowed to delete the friend',
      },
      404: {
        description: 'The friend does not exist',
      },
    },
  },
)

export const endpoints = {
  createForLoggedUser,
  generateInviteToken,
  verifyInviteToken,
  update,
  deleteById,
}
