import z from 'zod'
import omit from 'lodash.omit'
import * as matchesModel from '../models/matches'
import * as playerModel from '../models/players'
import * as friendsModel from '../models/friends'
import { FriendType } from '../schemas/friends'
import type { playersCRUDSchema } from '../schemas/match'
import {
  matchUpdateDataSchema,
  matchCreationDataSchema,
  matchDTOSchema,
} from '../schemas/match'
import { playerDtoToDbModel } from '../schemas/player'
import { endpoint } from '../utils/endpoint'
import type { Transaction } from '../database'
import kysely from '../database'

type MatchDTO = z.infer<typeof matchDTOSchema>
type MatchCreationData = z.infer<typeof matchCreationDataSchema>
type MatchUpdateData = z.infer<typeof matchUpdateDataSchema>

export const checkAccess = {
  create: async (userId: number, matchCreationData: MatchCreationData) => {
    for (const player of matchCreationData.players) {
      const friendExists = await friendsModel.checkFriendshipExists({
        friend: player.friend,
        userId,
      })
      if (!friendExists) {
        return false
      }
    }

    return true
  },
  read: (userId: number, match: MatchDTO) =>
    match.authorId === userId ||
    match.players.some(
      (player) =>
        player.friend.type === FriendType.USER && player.friend.id === userId
    ),
  update: (userId: number, match: matchesModel.Match) =>
    match.authorId === userId,
  delete: (userId: number, match: matchesModel.Match) =>
    match.authorId === userId,
}

const createForLoggedUser = endpoint.POST('/me/matches')<
  void,
  MatchCreationData,
  MatchDTO
>(
  async (req, res) => {
    const { body: matchCreationData, userId } = req

    if (!(await checkAccess.create(userId, matchCreationData))) {
      return res.sendStatus(403)
    }

    const match = {
      ...omit(matchCreationData, ['players']),
      authorId: userId,
    }

    const matchId = await kysely.transaction().execute(async (transaction) => {
      // wrap match creation and player creation in a transaction
      const { id: matchId } = await matchesModel.create.call(
        { transaction },
        match
      )

      const { players } = matchCreationData
      const digestedPlayers = players.map((player) => ({
        ...playerDtoToDbModel(player),
        matchId,
      }))

      await playerModel.createMultiple.call({ transaction }, digestedPlayers)

      return matchId
    })
    if (!matchId) {
      return res.sendStatus(500)
    }

    // TODO: include fetching in transaction and create generic transaction approach
    const createdMatch = await matchesModel.getHydratedById({
      id: matchId,
    })
    if (!createdMatch) {
      return res.sendStatus(500)
    }

    res.status(201).send(createdMatch)
  },
  {
    summary: 'Creates a match for the logged user',
    tags: ['matches'],
    params: null,
    body: matchCreationDataSchema,
    responses: {
      201: {
        description: 'The created match',
        schema: matchDTOSchema,
      },
      403: {
        description: 'The logged user is not friends with one of the players',
      },
    },
  }
)

const getAllByLoggedUser = endpoint.GET('/me/matches')<void, void, MatchDTO[]>(
  async (req, res) => {
    const matches = await matchesModel.getHydratedByAuthor({
      authorId: req.userId,
    })
    res.status(200).send(matches)
  },
  {
    summary: 'Gets all the matches for the logged user',
    tags: ['matches'],
    params: null,
    body: null,
    responses: {
      200: {
        description: 'The matches',
        schema: z.array(matchDTOSchema),
      },
    },
  }
)

const getById = endpoint.GET('/matches/:matchId')<
  { matchId: string },
  void,
  MatchDTO
>(
  async (req, res) => {
    const { matchId } = req.params
    const match = await matchesModel.getHydratedById({ id: parseInt(matchId) })
    if (!match) {
      return res.sendStatus(404)
    }

    if (!checkAccess.read(req.userId, match)) {
      return res.sendStatus(403)
    }

    res.status(200).send(match)
  },
  {
    summary: 'Gets a match by id',
    tags: ['matches'],
    params: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
    body: null,
    responses: {
      200: {
        description: 'The match',
        schema: matchDTOSchema,
      },
      403: {
        description:
          'The logged user is not the author or a participant of the match',
      },
      404: {
        description: 'The match was not found',
      },
    },
  }
)

// TODO: add friendship validation
const handlePlayersCRUD = async (
  matchId: number,
  players: z.infer<typeof playersCRUDSchema>,
  transaction: Transaction
) => {
  if (players?.create) {
    const digestedPlayers = players.create.map((player) => ({
      ...playerDtoToDbModel(player),
      matchId,
    }))
    await playerModel.createMultiple.call({ transaction }, digestedPlayers)
  }

  if (players?.update) {
    const digestedPlayers = players.update.map((player) => ({
      ...playerDtoToDbModel(player),
      id: player.id,
    }))
    for (const { id, ...player } of digestedPlayers) {
      await playerModel.update({ id, player }, transaction)
    }
  }

  if (players?.delete) {
    await playerModel.deleteMultiple({ ids: players.delete }, transaction)
  }
}

const update = endpoint.PUT('/matches/:matchId')<
  { matchId: string },
  MatchUpdateData,
  MatchDTO
>(
  async (req, res) => {
    const matchId = parseInt(req.params.matchId, 10)

    const match = await matchesModel.getById({ id: matchId })
    if (!match) {
      return res.sendStatus(404)
    }

    if (!checkAccess.update(req.userId, match)) {
      return res.sendStatus(403)
    }

    const updated = await kysely.transaction().execute(async (transaction) => {
      const { players, ...matchDetails } = req.body

      const matchUpdated = await matchesModel.update.call(
        { transaction },
        matchId,
        matchDetails
      )
      if (!matchUpdated) {
        return false
      }

      await handlePlayersCRUD(matchId, players, transaction)

      return true
    })
    if (!updated) {
      return res.sendStatus(404)
    }

    const updatedMatch = await matchesModel.getHydratedById({ id: matchId })
    if (!updatedMatch) {
      return res.sendStatus(500)
    }
    return res.status(200).send(updatedMatch)
  },
  {
    summary: 'Updates a match',
    tags: ['matches'],
    params: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
    body: matchUpdateDataSchema,
    responses: {
      200: {
        description: 'The match was updated',
      },
      403: {
        description: 'The logged user is not the author of the match',
      },
      404: {
        description: 'The match was not found',
      },
    },
  }
)

const deleteById = endpoint.DELETE('/matches/:matchId')<
  { matchId: string },
  void,
  void
>(
  async (req, res) => {
    const matchId = parseInt(req.params.matchId, 10)

    const match = await matchesModel.getById({ id: matchId })
    if (!match) {
      return res.sendStatus(404)
    }

    if (!checkAccess.delete(req.userId, match)) {
      return res.sendStatus(403)
    }

    const matchDeleted = await matchesModel.deleteById({ id: matchId })
    if (!matchDeleted) {
      return res.sendStatus(404)
    }

    res.sendStatus(200)
  },
  {
    summary: 'Deletes a match',
    tags: ['matches'],
    params: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
    body: null,
    responses: {
      200: {
        description: 'The match was deleted',
      },
      403: {
        description: 'The logged user is not the author of the match',
      },
      404: {
        description: 'The match was not found',
      },
    },
  }
)

export const endpoints = {
  createForLoggedUser,
  getAllByLoggedUser,
  getById,
  update,
  deleteById,
}
