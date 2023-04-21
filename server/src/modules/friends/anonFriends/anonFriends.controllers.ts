import type { z } from 'zod'
import * as anonFriendsModel from './anonFriends.model'

import { endpoint } from '../../../utils/endpoint.utils'
import { FriendType } from '../friends.schema'
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

const createForLoggedUser = endpoint.POST('/me/anonfriends')<
  void,
  z.infer<typeof anonFriendCreationDataSchema>,
  z.infer<typeof anonFriendDTOSchema>
>(
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
    params: null,
    body: anonFriendCreationDataSchema,
    responses: {
      201: {
        description: 'The created anonymous friend',
        schema: anonFriendDTOSchema,
      },
    },
  }
)

const update = endpoint.PUT('/me/anonfriends/:anonFriendId')<
  { anonFriendId: string },
  z.infer<typeof anonFriendUpdateDataSchema>,
  z.infer<typeof anonFriendDTOSchema>
>(
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
    params: {
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
  }
)

const deleteById = endpoint.DELETE('/me/anonfriends/:anonFriendId')<
  { anonFriendId: string },
  void,
  void
>(
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
    params: {
      anonFriendId: {
        type: 'number',
        description: 'The id of the anonymous friend to delete',
      },
    },
    body: null,
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
  }
)

export const endpoints = {
  createForLoggedUser,
  update,
  deleteById,
}
