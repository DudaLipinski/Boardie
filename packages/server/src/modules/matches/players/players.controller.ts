import z from 'zod'
import { endpoint } from '@boardie/endpoints'
import * as matchesModel from '../matches.model'
import * as friendsModel from '../../friends/friends.model'
import { FriendType } from '../../friends/friends.schema'
import type { MatchDTO } from '../matches.schema'
import {
  playerDtoToDbModel,
  playerDTOSchema,
  playerCreationDataSchema,
  playerUpdateDataSchema,
} from './players.schema'
import * as playersModel from './players.model'

type PlayerCreationData = z.infer<typeof playerCreationDataSchema>
type PlayerUpdateData = z.infer<typeof playerUpdateDataSchema>

export const checkPlayerFriendship = (
  userId: number,
  player: PlayerCreationData | PlayerUpdateData,
) => {
  const { friend } = player

  const isUserItself = friend.type === FriendType.USER && friend.id === userId
  if (isUserItself) {
    return true
  }

  return friendsModel.genericCheckFriendshipExistsWith(
    userId,
    friend.id,
    friend.type,
  )
}

const checkAccess = {
  create: async (
    userId: number,
    match: matchesModel.Match,
    player: PlayerCreationData,
  ) =>
    match.authorId === userId && (await checkPlayerFriendship(userId, player)),
  read: (userId: number, match: MatchDTO) =>
    match.authorId === userId ||
    match.players.some(
      (player) =>
        player.friend.type === FriendType.USER && player.friend.id === userId,
    ),
  update: async (
    userId: number,
    match: matchesModel.Match,
    player: PlayerUpdateData,
  ) =>
    match.authorId === userId && (await checkPlayerFriendship(userId, player)),
  delete: (userId: number, match: matchesModel.Match) =>
    match.authorId === userId,
}

const getAllByMatchId = endpoint.get(
  '/matches/:matchId/players',
  async (req, res) => {
    const { matchId } = req.params

    const match = await matchesModel.getHydratedById({
      id: parseInt(matchId),
    })
    if (!match) {
      return res.sendStatus(404)
    }
    if (!checkAccess.read(req.userId, match)) {
      return res.sendStatus(403)
    }

    res.status(200).send(match.players)
  },
  {
    summary: 'Gets all players by match id',
    tags: ['matches/players'],
    pathParams: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
    responses: {
      200: {
        description: 'The players',
        schema: z.array(playerDTOSchema),
      },
      404: {
        description: 'The match was not found',
      },
    },
  },
)

const create = endpoint.post(
  '/matches/:matchId/players',
  async (req, res) => {
    const matchId = parseInt(req.params.matchId)
    const userId = req.userId
    const player = req.body

    const match = await matchesModel.getById({ id: matchId })
    if (!match) {
      return res.sendStatus(404)
    }

    if (!(await checkAccess.create(userId, match, player))) {
      return res.sendStatus(403)
    }

    const createdPlayer = await playersModel.create({
      matchId,
      ...playerDtoToDbModel(player),
    })
    if (!createdPlayer) {
      return res.sendStatus(500)
    }

    res.status(200).send(createdPlayer)
  },
  {
    summary: 'Creates a player',
    tags: ['matches/players'],
    pathParams: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
    body: playerCreationDataSchema,
    responses: {
      200: {
        description: 'The created player',
        schema: playerDTOSchema,
      },
      403: {
        description:
          "The user doesn't have permissions to update the match, or doesn't have a friendship with the friend related to the player trying to be created",
      },
      404: {
        description: 'The match was not found',
      },
    },
  },
)

const update = endpoint.put(
  '/matches/:matchId/players/:playerId',
  async (req, res) => {
    const matchId = parseInt(req.params.matchId)
    const playerId = parseInt(req.params.playerId)
    const userId = req.userId
    const player = req.body

    const exists = await playersModel.checkIfExists({
      id: playerId,
    })
    if (!exists) {
      return res.sendStatus(404)
    }

    // We shouldn't be relying on the matchId from the URL,
    // we should instead check if the player belongs to the match
    const match = await matchesModel.getById({ id: matchId })
    if (!match) {
      return res.sendStatus(404)
    }
    if (!(await checkAccess.update(userId, match, player))) {
      return res.sendStatus(403)
    }

    const wasUpdated = await playersModel.update({
      id: playerId,
      player: playerDtoToDbModel(player),
    })
    if (!wasUpdated) {
      return res.sendStatus(404)
    }

    const updatedPlayer = await playersModel.getById({ id: playerId })
    if (!updatedPlayer) {
      return res.sendStatus(500)
    }
    res.status(200).send(updatedPlayer)
  },
  {
    summary: 'Updates a player',
    tags: ['matches/players'],
    pathParams: {
      matchId: {
        type: 'string',
        description: 'The id of the match that contains the player',
      },
      playerId: {
        type: 'string',
        description: 'The id of the player',
      },
    },
    body: playerUpdateDataSchema,
    responses: {
      200: {
        description: 'The updated player',
        schema: playerDTOSchema,
      },
      403: {
        description:
          "The user doesn't have permissions to update the match, or doesn't have a friendship with the friend related to the player trying to be updated",
      },
      404: {
        description: 'The match or player was not found',
      },
    },
  },
)

const deleteById = endpoint.delete(
  '/matches/:matchId/players/:playerId',
  async (req, res) => {
    const matchId = parseInt(req.params.matchId)
    const playerId = parseInt(req.params.playerId)
    const userId = req.userId

    // We shouldn't be relying on the matchId from the URL,
    // we should instead check if the player belongs to the match
    const match = await matchesModel.getById({ id: matchId })
    if (!match) {
      return res.status(404).send({ message: 'Match not found' })
    }

    if (!checkAccess.delete(userId, match)) {
      return res.sendStatus(403)
    }

    const deleted = await playersModel.deleteById({
      id: playerId,
      matchId,
    })
    if (!deleted) {
      return res.sendStatus(404)
    }

    return res.sendStatus(200)
  },
  {
    summary: 'Deletes a player by id',
    tags: ['matches/players'],
    pathParams: {
      matchId: {
        type: 'string',
        description: 'The id of the match that contains the player',
      },
      playerId: {
        type: 'string',
        description: 'The id of the player',
      },
    },
    responses: {
      200: {
        description: 'The player was deleted',
      },
      403: {
        description: "The user doesn't have permissions to update the match",
      },
      404: {
        description: 'The match or player was not found',
      },
    },
  },
)

export const endpoints = {
  getAllByMatchId,
  create,
  update,
  deleteById,
}
