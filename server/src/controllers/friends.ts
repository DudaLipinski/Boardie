import { RequestHandler } from 'express'
import produce from 'immer'
import {
  AnonFriendCreationDTO,
  validateAnonFriendCreationSchema,
} from '../schemas/anonFriend'
import * as anonFriendsModel from '../models/anonFriends'

import { getErrorMessage } from '../schemas/utils'
import { logInternalError } from '../utils/log'

interface GenericFriend {
  id: number
  fullName: string
  isAnonymous: boolean
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
    res.status(200).send({
      id,
      fullName: anonFriend.fullName,
    })
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}

export const getAllByLoggedUser: RequestHandler = async (req, res) => {
  const { userId } = req

  try {
    const anonFriends: GenericFriend[] = (
      await anonFriendsModel.getAllByUserId({ userId })
    ).map((friend) => ({ ...friend, isAnonymous: true }))

    res.status(200).send(anonFriends)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}
