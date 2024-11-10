import z from 'zod'
import omit from 'lodash.omit'
import { FriendType } from '../friends/friends.schema'
import { endpoint } from '../../utils/endpoint.utils'
import type { Transaction } from '../../database'
import kysely from '../../database'
import { genericCheckFriendshipExistsWith } from '../friends/friends.model'
import * as matchesModel from './matches.model'
import * as playerModel from './players/players.model'
import type {
  MatchCreationData,
  MatchDTO,
  MatchUpdateData,
  Players,
  BoardgameWinnersSummaryDTO,
} from './matches.schema'
import {
  matchUpdateDataSchema,
  matchCreationDataSchema,
  matchDTOSchema,
  boardgameWinnersSummaryDTOSchema,
} from './matches.schema'
import { playerDtoToDbModel } from './players/players.schema'
import { utcToMysql } from '../../utils/date.utils'

export const getUniqueFriendsFromPlayers = (
  players: MatchCreationData['players'],
) => {
  const friends = players.map((player) => player.friend)

  const uniqueFriends: Players[number]['friend'][] = []
  friends.forEach((friend) => {
    if (
      !uniqueFriends.find(
        (uniqueFriend) =>
          friend.id === uniqueFriend.id && friend.type === uniqueFriend.type,
      )
    ) {
      uniqueFriends.push(friend)
    }
  })

  return uniqueFriends
}

const checkPlayersFriendship = async (
  userId: number,
  players: MatchCreationData['players'] | undefined,
) => {
  if (!players?.length) {
    return true
  }

  const uniqueFriends = getUniqueFriendsFromPlayers(players)
  for (const friend of uniqueFriends) {
    const isUserItself = friend.type === FriendType.USER && friend.id === userId

    if (
      !isUserItself &&
      !(await genericCheckFriendshipExistsWith(userId, friend.id, friend.type))
    ) {
      return false
    }
  }

  return true
}

export const checkAccess = {
  create: (userId: number, players: Players) =>
    checkPlayersFriendship(userId, players),
  read: (userId: number, match: MatchDTO) =>
    match.authorId === userId ||
    match.players.some(
      (player) =>
        player.friend.type === FriendType.USER && player.friend.id === userId,
    ),
  update: async (
    userId: number,
    authorId: number | null,
    involvedPlayers: Players,
  ) => {
    if (authorId !== userId) {
      return false
    }

    return checkPlayersFriendship(userId, involvedPlayers)
  },
  delete: (userId: number, match: matchesModel.Match) =>
    match.authorId === userId,
}

const createForLoggedUser = endpoint.POST('/me/matches')<
  void,
  MatchCreationData,
  MatchDTO,
  void
>(
  async (req, res) => {
    const { body: matchCreationData, userId } = req

    if (!(await checkAccess.create(userId, matchCreationData.players))) {
      return res.sendStatus(403)
    }

    const match = {
      ...omit(matchCreationData, ['players']),
      startedAt: utcToMysql(matchCreationData.startedAt),
      endedAt: utcToMysql(matchCreationData.endedAt),
      authorId: userId,
    }

    const matchId = await kysely
      .transaction()
      .execute(async (transaction) => {
        // wrap match creation and player creation in a transaction
        const matchId = await matchesModel.create(match, transaction)
        if (!matchId) {
          throw new Error('Failed to create match')
        }

        const { players } = matchCreationData
        const digestedPlayers = players.map((player) => ({
          ...playerDtoToDbModel(player),
          matchId,
        }))

        await playerModel.createMultiple(digestedPlayers, transaction)

        return matchId
      })
      .catch((error) => ({ error }))

    if (typeof matchId !== 'number' && matchId?.error) {
      console.log('--- matchId.error ---') // [XXX] REMOVE BEFORE COMMITING
      console.log(matchId.error) // [XXX] REMOVE BEFORE COMMITING
      return matchId.error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY'
        ? res.sendStatus(400)
        : res.sendStatus(500)
    }
    if (typeof matchId !== 'number') {
      console.log('--- HERE ---') // [XXX] REMOVE BEFORE COMMITING
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
    body: matchCreationDataSchema,
    responses: {
      201: {
        description: 'The created match',
        schema: matchDTOSchema,
      },
      403: {
        description: 'The logged user is not friends with one of the players',
      },
      404: {
        description: 'No boardgame with the given id was found',
      },
    },
  },
)

const getAllByLoggedUser = endpoint.GET('/me/matches')<
  void,
  void,
  MatchDTO[],
  void
>(
  async (req, res) => {
    const matches = await matchesModel.getHydratedByUser(req.userId)
    res.status(200).send(matches)
  },
  {
    summary: 'Gets all the matches for the logged user',
    tags: ['matches'],
    responses: {
      200: {
        description: 'The matches',
        schema: z.array(matchDTOSchema),
      },
    },
  },
)

const getById = endpoint.GET('/matches/:matchId')<
  { matchId: string },
  void,
  MatchDTO,
  void
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
    pathParams: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
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
  },
)

// TODO: add friendship validation
const handlePlayersCRUD = async (
  matchId: number,
  players: MatchUpdateData['players'],
  transaction: Transaction,
) => {
  if (players?.create?.length) {
    const digestedPlayers = players.create.map((player) => ({
      ...playerDtoToDbModel(player),
      matchId,
    }))
    await playerModel.createMultiple(digestedPlayers, transaction)
  }

  if (players?.update?.length) {
    const digestedPlayers = players.update.map((player) => ({
      ...playerDtoToDbModel(player),
      id: player.id,
    }))
    for (const { id, ...player } of digestedPlayers) {
      await playerModel.update({ id, player }, transaction)
    }
  }

  if (players?.delete?.length) {
    await playerModel.deleteMultiple({ ids: players.delete }, transaction)
  }
}

const update = endpoint.PUT('/matches/:matchId')<
  { matchId: string },
  MatchUpdateData,
  MatchDTO,
  void
>(
  async (req, res) => {
    const matchId = parseInt(req.params.matchId, 10)

    const match = await matchesModel.getById({ id: matchId })
    if (!match) {
      return res.sendStatus(404)
    }

    const involvedPlayers = [
      ...(req.body.players.create ?? []),
      ...(req.body.players.update ?? []),
    ]
    if (
      !(await checkAccess.update(req.userId, match.authorId, involvedPlayers))
    ) {
      return res.sendStatus(403)
    }

    const updated = await kysely.transaction().execute(async (transaction) => {
      const { players, ...matchDetails } = req.body

      const matchUpdated = await matchesModel.update(
        matchId,
        matchDetails,
        transaction,
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
    pathParams: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
    body: matchUpdateDataSchema,
    responses: {
      200: {
        description: 'The match was updated',
        schema: matchDTOSchema,
      },
      403: {
        description: 'The logged user is not the author of the match',
      },
      404: {
        description: 'The match was not found',
      },
    },
  },
)

const deleteById = endpoint.DELETE('/matches/:matchId')<
  { matchId: string },
  void,
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
    pathParams: {
      matchId: {
        type: 'string',
        description: 'The id of the match',
      },
    },
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
  },
)

export const getWinnersSummary = endpoint.GET('/me/matches/winners/summary')<
  void,
  void,
  {
    winnersByBoardgame: BoardgameWinnersSummaryDTO[]
    matchesCount: number
  },
  void
>(
  async (req, res) => {
    res.status(200).send(await matchesModel.getWinnersSummary(req.userId))
  },
  {
    summary: 'Gets the winners summary for the logged user',
    tags: ['matches'],
    responses: {
      200: {
        description:
          'The summary of winners for matches played or authored by the user',
        schema: z.object({
          winnersByBoardgame: z.array(boardgameWinnersSummaryDTOSchema),
          matchesCount: z.number(),
        }),
      },
    },
  },
)

export const endpoints = {
  createForLoggedUser,
  getAllByLoggedUser,
  getById,
  update,
  deleteById,
  getWinnersSummary,
}
