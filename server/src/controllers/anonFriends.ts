import { RequestHandler } from 'express'
import {
  AnonFriendCreationData,
  AnonFriendDTO,
  AnonFriendUpdateData,
  validateAnonFriendCreationSchema,
  validateAnonFriendUpdateSchema,
} from '../schemas/anonFriend'
import * as anonFriendsModel from '../models/anonFriends'

import { getErrorMessage } from '../schemas/utils'
import { logInternalError } from '../utils/log'
import { FriendType } from '../models/utils'
import { ErrorBody } from '../types/errors'
import { FORBIDDEN_ERROR } from '../utils/errors'

export const createForLoggedUser: RequestHandler<
  never,
  AnonFriendDTO | ErrorBody,
  AnonFriendCreationData
> = async (req, res) => {
  const anonFriendCreationData = req.body
  if (!anonFriendCreationData) {
    return res.sendStatus(400)
  }

  const validAnonFriend = validateAnonFriendCreationSchema(
    anonFriendCreationData
  )
  if (!validAnonFriend) {
    const errorMessage = getErrorMessage(validateAnonFriendCreationSchema)

    res.status(400).send({ message: errorMessage })
    return
  }

  try {
    const id = await anonFriendsModel.create({
      ...anonFriendCreationData,
      userId: req.userId,
    })
    res.status(201).send({
      id,
      fullName: anonFriendCreationData.fullName,
      type: FriendType.ANON_FRIEND,
    })
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}

export const update: RequestHandler<
  { anonFriendId: string },
  AnonFriendDTO | ErrorBody,
  AnonFriendUpdateData
> = async (req, res) => {
  const anonFriendUpdateData = req.body
  const anonFriendId =
    req.params.anonFriendId && parseInt(req.params.anonFriendId, 10)
  if (!anonFriendUpdateData || !anonFriendId) {
    return res.sendStatus(400)
  }

  const validAnonFriend = validateAnonFriendUpdateSchema(anonFriendUpdateData)
  if (!validAnonFriend) {
    const errorMessage = getErrorMessage(validateAnonFriendUpdateSchema)

    res.status(400).send({ message: errorMessage })
    return
  }

  try {
    const canUpdateAnonFriend = await anonFriendsModel.checkUpdatePermission({
      id: anonFriendId,
      userId: req.userId,
    })
    if (canUpdateAnonFriend === undefined) {
      return res.status(404).send({ message: 'Anon friend not found' })
    }
    if (!canUpdateAnonFriend) {
      return res.status(403).send(FORBIDDEN_ERROR)
    }

    await anonFriendsModel.update(anonFriendId, anonFriendUpdateData)
    res.status(200).send({
      id: anonFriendId,
      fullName: anonFriendUpdateData.fullName,
      type: FriendType.ANON_FRIEND,
    })
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}

export const deleteById: RequestHandler<
  { anonFriendId: string },
  never | ErrorBody,
  never
> = async (req, res) => {
  const anonFriendId =
    req.params.anonFriendId && parseInt(req.params.anonFriendId, 10)
  if (!anonFriendId) {
    return res.sendStatus(400)
  }

  try {
    const canDeleteAnonFriend = await anonFriendsModel.checkDeletePermission({
      id: anonFriendId,
      userId: req.userId,
    })
    if (canDeleteAnonFriend === undefined) {
      return res.sendStatus(404)
    }
    if (!canDeleteAnonFriend) {
      return res.status(403).send(FORBIDDEN_ERROR)
    }

    const deleted = await anonFriendsModel.deleteById(anonFriendId)
    if (!deleted) {
      return res.sendStatus(404)
    }

    res.sendStatus(200)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}
