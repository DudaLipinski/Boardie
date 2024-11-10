import z from 'zod'
import * as usersModel from '../users/users.model'
import { endpoint } from '../../utils/endpoint.utils'
import kysely from '../../database'
import * as anonFriendsModel from './anonFriends/anonFriends.model'
import * as friendsModel from './friends.model'

import {
  genericFriendDTOSchema,
  FriendType,
  friendshipRequestSchema,
  answerFriendshipRequestSchema,
  existentFriendshipRequestSchema,
} from './friends.schema'

type GenericFriend = z.infer<typeof genericFriendDTOSchema>

const getAllByLoggedUser = endpoint.GET('/me/friends')<
  void,
  void,
  GenericFriend[],
  void
>(
  async (req, res) => {
    const anonFriends = (await anonFriendsModel.getAllByUserId(req.userId)).map(
      (friend) => ({ ...friend, type: FriendType.ANON_FRIEND }),
    )

    const friends = (await friendsModel.getAllByUserId(req.userId)).map(
      (friend) => ({
        id: friend.id as number,
        fullName: `${friend.firstName} ${friend.middleAndSurname}`,
        type: FriendType.USER,
      }),
    )

    res.status(200).send([...friends, ...anonFriends])
  },
  {
    summary: 'Gets all friends for the logged user',
    tags: ['friends'],
    responses: {
      200: {
        description: "The logged user's friends",
        schema: z.array(genericFriendDTOSchema),
      },
    },
  },
)

const sendRequest = endpoint.POST('/me/friends/requests')<
  void,
  z.infer<typeof friendshipRequestSchema>,
  void,
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

    const friendshipExists = await friendsModel.checkFriendshipExists([
      req.userId,
      requestedUserId,
    ])
    if (friendshipExists) {
      return res.sendStatus(409)
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
    body: friendshipRequestSchema,
    responses: {
      200: {
        description: 'The request was sent',
      },
      404: {
        description: 'The requested user does not exist',
      },
      409: {
        description:
          'The friendship already exists or the request was already sent',
      },
    },
  },
)

const getAllRequests = endpoint.GET('/me/friends/requests')<
  void,
  void,
  z.infer<typeof existentFriendshipRequestSchema>[],
  void
>(
  async (req, res) => {
    const requests = (await friendsModel.getFriendshipRequests(req.userId)).map(
      (request) => ({
        userId: request.userId as number,
        fullName: `${request.firstName} ${request.middleAndSurname}`,
      }),
    )

    res.status(200).send(requests)
  },
  {
    summary: 'Gets all friendship requests for the logged user',
    tags: ['friends'],
    responses: {
      200: {
        description: "The logged user's friendship requests",
        schema: z.array(existentFriendshipRequestSchema),
      },
    },
  },
)

const answerRequest = endpoint.PUT('/me/friends/requests/:requestingUserId')<
  { requestingUserId: number },
  z.infer<typeof answerFriendshipRequestSchema>,
  void,
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

    const result = await kysely.transaction().execute(async (transaction) => {
      const requestWasFound = await friendsModel.deleteRequest(
        friendRequest,
        transaction,
      )
      if (!requestWasFound) {
        return 'not-found' as const
      }

      // If the request was found, also delete the inverse request
      // in the case where the requested user had also sent a request
      // to the requesting user
      await friendsModel.deleteRequest(
        {
          requestingUserId: friendRequest.requestedUserId,
          requestedUserId: friendRequest.requestingUserId,
        },
        transaction,
      )

      if (!accept) {
        return
      }

      const friendshipCreated = await friendsModel.createFriendship(
        [friendRequest.requestingUserId, friendRequest.requestedUserId],
        transaction,
      )
      if (!friendshipCreated) {
        return 'conflict' as const
      }
    })

    if (result === 'not-found') {
      return res.sendStatus(404)
    }
    if (result === 'conflict') {
      return res.sendStatus(409)
    }

    res.sendStatus(200)
  },
  {
    summary: 'Answers a friendship request',
    tags: ['friends'],
    pathParams: {
      requestingUserId: {
        type: 'number',
        description:
          "The id of the user requesting to be the logged user's friend",
      },
    },
    body: answerFriendshipRequestSchema,
    responses: {
      200: {
        description: 'The request answer has been processed',
      },
      404: {
        description: 'The friendship request does not exist',
      },
      409: {
        description: 'The friendship already exists',
      },
    },
  },
)

const deleteFriend = endpoint.DELETE('/me/friends/:friendUserId')<
  { friendUserId: number },
  void,
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
    pathParams: {
      friendUserId: {
        type: 'number',
        description: 'The id of the user to delete the friendship with',
      },
    },
    responses: {
      200: {
        description: 'The friendship was deleted',
      },
      404: {
        description: 'The friendship does not exist',
      },
    },
  },
)

export const endpoints = {
  getAllByLoggedUser,
  sendRequest,
  answerRequest,
  getAllRequests,
  deleteFriend,
}
