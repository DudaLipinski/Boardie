import { CURRENT_DATETIME_QUERY } from '../../database/database.utils'
import type { Transaction } from '../../database'
import kysely from '../../database'
import { getAllByMatchId } from './players/players.model'

export interface Match {
  id: number
  authorId: number | null
  boardgameName: string
  location: string | null
  notes: string | null
  createdAt: string
  deletedAt: string | null
  startedAt: string
  endedAt: string | null
}

export function create(
  this: { transaction?: Transaction },
  match: Omit<Match, 'id' | 'createdAt' | 'deletedAt'>
) {
  return (this.transaction ?? kysely)
    .insertInto('match')
    .values(match)
    .returning('id')
    .executeTakeFirstOrThrow()
}

export function update(
  this: { transaction?: Transaction },
  matchId: number,
  match: Omit<Match, 'id' | 'authorId' | 'createdAt' | 'deletedAt'>
) {
  return (this.transaction ?? kysely)
    .updateTable('match')
    .set(match)
    .where('id', '==', matchId)
    .executeTakeFirst()
    .then((result) => result.numUpdatedRows === 1n)
}

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

  const players = await getAllByMatchId({ matchId: match.id })
  return {
    ...match,
    players,
  }
}

export const getHydratedByUser = async (userId: number) => {
  const matches = await kysely
    .selectFrom('match')
    .selectAll()
    .where((qb) =>
      qb.where('authorId', '==', userId).orWhereExists((qb) =>
        // TODO: solve this n + 1 problem
        qb
          .selectFrom('player')
          .select('id')
          .whereRef('player.matchId', '==', 'match.id')
          .where('player.userId', '==', userId)
          .limit(1)
      )
    )
    .where('deletedAt', 'is', null)
    .orderBy('createdAt', 'desc')
    .execute()

  const players = await getAllByMatchId({ matchId: matches.map((m) => m.id) })

  const playersByMatchId = players.reduce((acc, player) => {
    if (acc[player.matchId]) {
      acc[player.matchId].push(player)
    } else {
      acc[player.matchId] = [player]
    }
    return acc
  }, {} as Record<number, typeof players>)

  const result = matches.map((match) => ({
    ...match,
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
