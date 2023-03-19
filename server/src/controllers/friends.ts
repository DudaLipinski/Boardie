import * as anonFriendsModel from '../models/anonFriends'

import { FriendType } from '../models/utils'
import { endpoint } from '../utils/endpoint'
import { genericFriendDTO } from '../schemas/genericFriend'

export interface GenericFriend {
  id: number
  type: FriendType
}

export interface HydratedGenericFriend extends GenericFriend {
  fullName: string
}

export const getAllByLoggedUser = endpoint.GET('/me/friends')<
  void,
  void,
  HydratedGenericFriend[]
>(
  async (req, res) => {
    const anonFriends: HydratedGenericFriend[] = (
      await anonFriendsModel.getAllByUserId({ userId: req.userId })
    ).map((friend) => ({ ...friend, type: FriendType.ANON_FRIEND }))

    res.status(200).send(anonFriends)
  },
  {
    summary: 'Gets all friends for the logged user',
    tags: ['friends'],
    params: null,
    body: null,
    responses: {
      200: {
        description: "The logged user's friends",
        schema: {
          type: 'array',
          items: genericFriendDTO,
        },
      },
    },
  }
)
