import z from 'zod'
import * as anonFriendsModel from '../models/anonFriends'

import { endpoint } from '../utils/endpoint'
import { genericFriendDTOSchema, FriendType } from '../schemas/friends'

type GenericFriend = z.infer<typeof genericFriendDTOSchema>

const getAllByLoggedUser = endpoint.GET('/me/friends')<
  void,
  void,
  GenericFriend[]
>(
  async (req, res) => {
    const anonFriends = (
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
        schema: z.array(genericFriendDTOSchema),
      },
    },
  }
)

export const endpoints = {
  getAllByLoggedUser,
}
