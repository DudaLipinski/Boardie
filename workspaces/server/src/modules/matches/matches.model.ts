import { sql } from 'kysely'
import { CURRENT_DATETIME_QUERY } from '../../database/database.utils'
import type { Transaction } from '../../database'
import kysely from '../../database'
import * as boardgamesModel from '../boardgames/boardgames.model'
import { FriendType } from '../friends/friends.schema'
import type { Boardgame } from '../boardgames/boardgames.model'
import * as playersModel from './players/players.model'
import * as friendsModel from '../friends/friends.model'
import * as anonFriendsModel from '../friends/anonFriends/anonFriends.model'

export interface Match {
  id: number
  authorId: number | null
  boardgameId: number
  location: string | null
  notes: string | null
  createdAt: string
  deletedAt: string | null
  startedAt: string
  endedAt: string | null
}

export const create = (
  match: Omit<Match, 'id' | 'createdAt' | 'deletedAt'>,
  transaction?: Transaction,
) =>
  (transaction ?? kysely)
    .insertInto('match')
    .values(match)
    .returning('id')
    .executeTakeFirstOrThrow()

export const update = (
  matchId: number,
  match: Omit<Match, 'id' | 'authorId' | 'createdAt' | 'deletedAt'>,
  transaction?: Transaction,
) =>
  (transaction ?? kysely)
    .updateTable('match')
    .set(match)
    .where('id', '==', matchId)
    .executeTakeFirst()
    .then((result) => result.numUpdatedRows === 1n)

export const getHydratedById = async ({ id }: { id: number }) => {
  const match = await kysely
    .selectFrom('match')
    .selectAll()
    .where('id', '==', id)
    .where('deletedAt', 'is', null)
    .executeTakeFirst()

  if (!match) {
    return null
  }

  const boardgame = (await boardgamesModel.getById(match.boardgameId)) ?? null

  const players = await playersModel.getAllByMatchId({ matchId: match.id })
  return {
    ...match,
    players,
    boardgame,
  }
}

const matchesAuthoredOrPlayedByUserQuery = (userId: number) =>
  kysely
    .selectFrom('match')
    .select('match.id')
    .distinct()
    .leftJoin('player', 'match.id', 'player.matchId')
    .where((eb) =>
      eb.or([
        eb('match.authorId', '==', userId),
        eb('player.userId', '==', userId),
      ]),
    )
    .where('match.deletedAt', 'is', null)

export const getHydratedByUser = async (userId: number) => {
  const matches = await kysely
    .selectFrom('match')
    .selectAll()
    .where('match.id', 'in', matchesAuthoredOrPlayedByUserQuery(userId))
    .where('deletedAt', 'is', null)
    .orderBy('createdAt', 'desc')
    .execute()

  const players = await playersModel.getAllByMatchId({
    matchId: matches.map((m) => m.id),
  })
  const playersByMatchId = players.reduce((acc, player) => {
    if (acc[player.matchId]) {
      acc[player.matchId].push(player)
    } else {
      acc[player.matchId] = [player]
    }
    return acc
  }, {} as Record<number, typeof players>)

  const boardgamesById = await boardgamesModel.getAllMappedById()

  const result = matches.map((match) => ({
    ...match,
    boardgame: boardgamesById[match.boardgameId] ?? null,
    players: playersByMatchId[match.id] ?? [],
  }))

  return result
}

export const getById = (params: { id: number }) =>
  kysely
    .selectFrom('match')
    .selectAll()
    .where('id', '==', params.id)
    .where('deletedAt', 'is', null)
    .executeTakeFirst()

export const deleteById = (params: { id: number }) =>
  kysely
    .updateTable('match')
    .set({ deletedAt: CURRENT_DATETIME_QUERY })
    .where('id', '==', params.id)
    .executeTakeFirst()
    .then((result) => result.numUpdatedRows === 1n)

type BoardgameWinnersSummary = {
  boardgame: Boardgame
  unknownPlayersWins: number
  players: {
    id: number
    type: FriendType
    wins: number
  }[]
}
export const getWinnersSummary = async (userId: number) => {
  const boardgamesById = await boardgamesModel.getAllMappedById()

  const matchIds = await matchesAuthoredOrPlayedByUserQuery(userId)
    .execute()
    .then((result) => result.map((row) => row.id))

  const friendIds = new Set(
    (await friendsModel.getAllByUserId(userId)).map((f) => f.id),
  )
  const anonFriendIds = new Set(
    (await anonFriendsModel.getAllByUserId(userId)).map((f) => f.id),
  )

  const winnersByBoardgame = await kysely
    .selectFrom('player')
    .leftJoin('match', 'player.matchId', 'match.id')
    .select([
      'match.boardgameId',
      'player.userId',
      'player.anonFriendId',
      sql<number>`count(*)`.as('wins'),
    ])
    .where('match.id', 'in', matchIds)
    .where('player.isWinner', '==', 1)
    .groupBy(['match.boardgameId', 'player.userId', 'player.anonFriendId'])
    .execute()
    .then((result) => {
      const summary: Record<number, BoardgameWinnersSummary> = {}

      result.forEach((row) => {
        if (!row.boardgameId) {
          return
        }

        if (!summary[row.boardgameId]) {
          summary[row.boardgameId] = {
            unknownPlayersWins: 0,
            boardgame: boardgamesById[row.boardgameId],
            players: [],
          }
        }

        if (
          (row.userId !== userId && row.userId && !friendIds.has(row.userId)) ||
          (row.anonFriendId && !anonFriendIds.has(row.anonFriendId))
        ) {
          summary[row.boardgameId].unknownPlayersWins += row.wins
          return
        }

        summary[row.boardgameId]!.players.push({
          id: row.userId ?? row.anonFriendId!,
          type: row.userId ? FriendType.USER : FriendType.ANON_FRIEND,
          wins: row.wins,
        })
      })

      return Object.values(summary)
    })

  return {
    matchesCount: matchIds.length,
    winnersByBoardgame,
  }
}
