import { RequestHandler } from 'express'
import produce from 'immer'
import {
  AnonFriendCreationDTO,
  validateAnonFriendCreationSchema,
} from '../schemas/anonFriend'
import * as anonFriendsModel from '../models/anonFriends'

import { getErrorMessage } from '../schemas/utils'
import { logInternalError } from '../utils/log'
import { FriendType } from '../models/utils'

export interface GenericFriend {
  id: number
  type: FriendType
}

export interface HydratedGenericFriend extends GenericFriend {
  fullName: string
}

export const createAnonymousForLoggedUser: RequestHandler = async (
  req,
  res
) => {
  const anonFriendCreationDTO = req.body as AnonFriendCreationDTO
  if (!anonFriendCreationDTO) {
    return res.sendStatus(400)
  }

  const anonFriend = produce(anonFriendCreationDTO, (anonFriend) => ({
    ...anonFriend,
    userId: req.userId,
  }))

  const validAnonFriend = validateAnonFriendCreationSchema(anonFriend)
  if (!validAnonFriend) {
    const errorMessage = getErrorMessage(validateAnonFriendCreationSchema)

    res.status(400).send({ message: errorMessage })
    return
  }

  try {
    const id = await anonFriendsModel.create(anonFriend)
    res.status(201).send({
      id,
      fullName: anonFriend.fullName,
      type: FriendType.ANON_FRIEND,
    })
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}

export const getAllByLoggedUser: RequestHandler = async (req, res) => {
  const { userId } = req

  try {
    const anonFriends: HydratedGenericFriend[] = (
      await anonFriendsModel.getAllByUserId({ userId })
    ).map((friend) => ({ ...friend, type: FriendType.ANON_FRIEND }))

    res.status(200).send(anonFriends)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}
