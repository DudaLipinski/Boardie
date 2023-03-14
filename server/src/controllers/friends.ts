import { RequestHandler } from 'express'
import * as anonFriendsModel from '../models/anonFriends'

import { logInternalError } from '../utils/log'
import { FriendType } from '../models/utils'

export interface GenericFriend {
  id: number
  type: FriendType
}

export interface HydratedGenericFriend extends GenericFriend {
  fullName: string
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
