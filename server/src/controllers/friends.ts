import z from 'zod'
import * as anonFriendsModel from '../models/anonFriends'
import * as friendsModel from '../models/friends'
import * as usersModel from '../models/users'

import { endpoint } from '../utils/endpoint'
import {
  genericFriendDTOSchema,
  FriendType,
  friendshipRequestSchema,
  answerFriendshipRequestSchema,
  existentFriendshipRequestSchema,
} from '../schemas/friends'
import kysely from '../database'

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
      if (requestedUser.id === req.userId) {
        return res.sendStatus(400)
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
        userId: request.userId as number,
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

const answerRequest = endpoint.PUT('/me/friends/requests/:requestingUserId')<
  { requestingUserId: number },
  z.infer<typeof answerFriendshipRequestSchema>,
  void
>(
  async (req, res) => {
    const { requestingUserId } = req.params
    const { accept } = req.body

    if (requestingUserId === req.userId) {
      return res.sendStatus(400)
    }

    const friendRequest = {
      requestingUserId,
      requestedUserId: req.userId,
    }

    await kysely.transaction().execute(async (transaction) => {
      const requestWasFound = await friendsModel.deleteRequest.call(
        { transaction },
        friendRequest
      )
      if (!requestWasFound) {
        return res.sendStatus(404)
      }

      // If the request was found, also delete the inverse request
      // in the case where the requested user had also sent a request
      // to the requesting user
      await friendsModel.deleteRequest.call(
        { transaction },
        {
          requestingUserId: friendRequest.requestedUserId,
          requestedUserId: friendRequest.requestingUserId,
        }
      )

      if (!accept) {
        return
      }

      const friendshipCreated = await friendsModel.createFriendship.call(
        { transaction },
        [friendRequest.requestingUserId, friendRequest.requestedUserId]
      )
      if (!friendshipCreated) {
        return res.sendStatus(409)
      }
    })

    res.sendStatus(200)
  },
  {
    summary: 'Answers a friendship request',
    tags: ['friends'],
    params: {
      requestingUserId: {
        type: 'number',
        description:
          "The id of the user requesting to be the logged user's friend",
      },
    },
    body: answerFriendshipRequestSchema,
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

const deleteFriend = endpoint.DELETE('/me/friends/:friendUserId')<
  { friendUserId: number },
  void,
  void
>(
  async (req, res) => {
    const { friendUserId } = req.params

    if (friendUserId === req.userId) {
      return res.sendStatus(400)
    }

    const friendshipDeleted = await friendsModel.deleteFriendship([
      req.userId,
      friendUserId,
    ])
    if (!friendshipDeleted) {
      return res.sendStatus(404)
    }

    res.sendStatus(200)
  },
  {
    summary: 'Deletes a friendship',
    tags: ['friends'],
    params: {
      friendUserId: {
        type: 'number',
        description: 'The id of the user to delete the friendship with',
      },
    },
    body: null,
    responses: {
      200: {
        description: 'The friendship was deleted',
      },
      404: {
        description: 'The friendship does not exist',
      },
    },
  }
)

export const endpoints = {
  getAllByLoggedUser,
  sendRequest,
  answerRequest,
  getAllRequests,
  deleteFriend,
}
