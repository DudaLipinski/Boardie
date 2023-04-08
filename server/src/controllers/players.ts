import z from 'zod'
import * as matchesModel from '../models/matches'
import * as playersModel from '../models/players'
import * as friendsModel from '../models/friends'
import {
  playerDtoToDbModel,
  playerDTOSchema,
  playerCreationDataSchema,
  playerUpdateDataSchema,
} from '../schemas/player'
import { endpoint } from '../utils/endpoint'
import { FriendType } from '../schemas/friends'

type PlayerDTO = z.infer<typeof playerDTOSchema>
type PlayerCreationData = z.infer<typeof playerCreationDataSchema>
type PlayerUpdateData = z.infer<typeof playerUpdateDataSchema>
export type PlayerData = PlayerCreationData

export const checkPlayerFriendship = (
  userId: number,
  player: PlayerCreationData | PlayerUpdateData
) => {
  const { friend } = player

  const isUserItself = friend.type === FriendType.USER && friend.id === userId
  if (isUserItself) {
    return true
  }

  return friendsModel.genericCheckFriendshipExistsWith(
    userId,
    friend.id,
    friend.type
  )
}

const checkAccess = {
  create: async (
    userId: number,
    match: matchesModel.Match,
    player: PlayerCreationData
  ) =>
    match.authorId === userId && (await checkPlayerFriendship(userId, player)),
  read: (userId: number, match: matchesModel.Match) =>
    match.authorId === userId,
  update: async (
    userId: number,
    match: matchesModel.Match,
    player: PlayerUpdateData
  ) =>
    match.authorId === userId && (await checkPlayerFriendship(userId, player)),
  delete: (userId: number, match: matchesModel.Match) =>
    match.authorId === userId,
}

const getAllByMatchId = endpoint.GET('/matches/:matchId/players')<
  { matchId: string },
  void,
  PlayerDTO[]
>(
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
    params: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
    body: null,
    responses: {
      200: {
        description: 'The players',
        schema: z.array(playerDTOSchema),
      },
      404: {
        description: 'The match was not found',
      },
    },
  }
)

const create = endpoint.POST('/matches/:matchId/players')<
  { matchId: string },
  PlayerCreationData,
  PlayerDTO
>(
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
    params: {
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
  }
)

const update = endpoint.PUT('/matches/:matchId/players/:playerId')<
  { matchId: string; playerId: string },
  PlayerUpdateData,
  PlayerDTO
>(
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
    params: {
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
  }
)

const deleteById = endpoint.DELETE('/matches/:matchId/players/:playerId')<
  { matchId: string; playerId: string },
  void,
  void
>(
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
    params: {
      matchId: {
        type: 'string',
        description: 'The id of the match that contains the player',
      },
      playerId: {
        type: 'string',
        description: 'The id of the player',
      },
    },
    body: null,
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
  }
)

export const endpoints = {
  getAllByMatchId,
  create,
  update,
  deleteById,
}
