import type {
  AnonFriendCreationData,
  AnonFriendDTO,
  AnonFriendUpdateData,
} from '../schemas/anonFriend'
import {
  anonFriendCreationData,
  anonFriendDTO,
  anonFriendUpdateData,
} from '../schemas/anonFriend'
import * as anonFriendsModel from '../models/anonFriends'

import { FriendType } from '../models/utils'
import { endpoint } from '../utils/endpoint'

const ANON_FRIENDS_ENDPOINT = '/me/anonfriends'

export const createForLoggedUser = endpoint.POST(ANON_FRIENDS_ENDPOINT)<
  void,
  AnonFriendCreationData,
  AnonFriendDTO
>(
  async (req, res) => {
    const id = await anonFriendsModel.create({
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
    body: anonFriendCreationData,
    responses: {
      201: {
        description: 'The created anonymous friend',
        schema: anonFriendDTO,
      },
    },
  }
)

export const update = endpoint.PUT(`${ANON_FRIENDS_ENDPOINT}/:anonFriendId`)<
  { anonFriendId: string },
  AnonFriendUpdateData,
  AnonFriendDTO
>(
  async (req, res) => {
    const anonFriendUpdateData = req.body
    const anonFriendId = parseInt(req.params.anonFriendId, 10)

    const canUpdateAnonFriend = await anonFriendsModel.checkUpdatePermission({
      id: anonFriendId,
      userId: req.userId,
    })
    if (canUpdateAnonFriend === undefined) {
      return res.sendStatus(404)
    }
    if (!canUpdateAnonFriend) {
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
    body: anonFriendUpdateData,
    responses: {
      200: {
        description: 'The updated anonymous friend',
        schema: anonFriendDTO,
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

export const deleteById = endpoint.DELETE(
  `${ANON_FRIENDS_ENDPOINT}/:anonFriendId`
)<{ anonFriendId: string }, void, void>(
  async (req, res) => {
    const anonFriendId = parseInt(req.params.anonFriendId, 10)

    const canDeleteAnonFriend = await anonFriendsModel.checkDeletePermission({
      id: anonFriendId,
      userId: req.userId,
    })
    if (canDeleteAnonFriend === undefined) {
      return res.sendStatus(404)
    }
    if (!canDeleteAnonFriend) {
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
