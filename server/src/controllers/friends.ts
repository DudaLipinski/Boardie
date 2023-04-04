import z from 'zod'
import * as anonFriendsModel from '../models/anonFriends'
import * as friendsModel from '../models/friends'
import * as usersModel from '../models/users'

import { endpoint } from '../utils/endpoint'
import {
  genericFriendDTOSchema,
  FriendType,
  friendshipRequestSchema,
  acceptFriendshipRequestSchema,
  existentFriendshipRequestSchema,
} from '../schemas/friends'

type GenericFriend = z.infer<typeof genericFriendDTOSchema>

const getAllByLoggedUser = endpoint.GET('/me/friends')<
  void,
  void,
  GenericFriend[]
>(
  async (req, res) => {
    const anonFriends = (await anonFriendsModel.getAllByUserId(req.userId)).map(
      (friend) => ({ ...friend, type: FriendType.ANON_FRIEND })
    )

    const friends = (await friendsModel.getAllByUserId(req.userId)).map(
      (friend) => ({
        id: friend.id as number,
        fullName: `${friend.firstName} ${friend.middleAndSurname}`,
        type: FriendType.USER,
      })
    )

    res.status(200).send([...friends, ...anonFriends])
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

const sendRequest = endpoint.POST('/me/friends/requests')<
  void,
  z.infer<typeof friendshipRequestSchema>,
  void
>(
  async (req, res) => {
    const { userEmail, userId: reqUserId } = req.body

    let requestedUserId
    if (userEmail) {
      const requestedUser = await usersModel.getByEmail(userEmail)
      if (!requestedUser) {
        return res.sendStatus(404)
      }

      requestedUserId = requestedUser.id
    } else if (reqUserId) {
      const userExists = await usersModel.checkExistsById(reqUserId)
      if (!userExists) {
        return res.sendStatus(404)
      }

      requestedUserId = reqUserId
    } else {
      return res.sendStatus(400)
    }

    const requestCreated = await friendsModel.createFriendshipRequest({
      requestingUserId: req.userId,
      requestedUserId,
    })
    if (!requestCreated) {
      return res.sendStatus(409)
    }

    res.sendStatus(200)
  },
  {
    summary: 'Sends a friendship request to another user',
    tags: ['friends'],
    params: null,
    body: friendshipRequestSchema,
    responses: {
      200: {
        description: 'The request was sent',
      },
      404: {
        description: 'The requested user does not exist',
      },
      409: {
        description: 'The friendship request already exists',
      },
    },
  }
)

const getAllRequests = endpoint.GET('/me/friends/requests')<
  void,
  void,
  z.infer<typeof existentFriendshipRequestSchema>[]
>(
  async (req, res) => {
    const requests = (await friendsModel.getFriendshipRequests(req.userId)).map(
      (request) => ({
        id: request.id as number,
        fullName: `${request.firstName} ${request.middleAndSurname}`,
      })
    )

    res.status(200).send(requests)
  },
  {
    summary: 'Gets all friendship requests for the logged user',
    tags: ['friends'],
    params: null,
    body: null,
    responses: {
      200: {
        description: "The logged user's friendship requests",
        schema: z.array(existentFriendshipRequestSchema),
      },
    },
  }
)

const acceptRequest = endpoint.POST('/me/friends')<
  void,
  z.infer<typeof acceptFriendshipRequestSchema>,
  void
>(
  async (req, res) => {
    const { userId: requestingUserId } = req.body
    if (requestingUserId === req.userId) {
      return res.sendStatus(400)
    }

    const requestExists = await friendsModel.acceptRequest({
      requestingUserId,
      requestedUserId: req.userId,
    })
    if (!requestExists) {
      return res.sendStatus(404)
    }

    res.sendStatus(200)
  },
  {
    summary: 'Accepts a friendship request',
    tags: ['friends'],
    params: null,
    body: acceptFriendshipRequestSchema,
    responses: {
      200: {
        description: 'The request was accepted',
      },
      404: {
        description: 'The friendship request does not exist',
      },
    },
  }
)

export const endpoints = {
  getAllByLoggedUser,
  sendRequest,
  acceptRequest,
  getAllRequests,
}
