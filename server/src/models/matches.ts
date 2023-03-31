import { CURRENT_DATETIME_QUERY } from '../utils/sql'
import type { MatchUpdateData } from '../schemas/match'
import type { PlayerDTO } from '../schemas/player'
import type { Transaction } from '../database'
import kysely from '../database'
import { getAllByMatchId } from './players'

export interface Match {
  id: number
  authorId: number | null
  boardgameName: string
  location?: string | null
  notes?: string | null
  createdAt: string
  deletedAt?: string | null
  startedAt: string
  endedAt?: string | null
}

export interface HydratedMatch extends Match {
  players: PlayerDTO[]
}

export function create(
  this: { transaction?: Transaction },
  match: Omit<Match, 'id'>
) {
  return (this.transaction ?? kysely)
    .insertInto('match')
    .values(match)
    .returning('id')
    .executeTakeFirstOrThrow()
}

export const update = (matchId: number, match: MatchUpdateData) =>
  kysely
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

  const players = await getAllByMatchId({ matchId: match.id })
  return {
    ...match,
    players,
  }
}

export const getHydratedByAuthor = async (params: { authorId: number }) => {
  const matches = await kysely
    .selectFrom('match')
    .selectAll()
    .where('authorId', '==', params.authorId)
    .where('deletedAt', 'is', null)
    .execute()

  /**
   * We are fine with this N+1 query since the server and the database
   * will be running within the same machine, with low latency
   */
  const result: HydratedMatch[] = []
  for (const match of matches) {
    if (!match) {
      continue
    }

    const players = await getAllByMatchId({ matchId: match.id })
    result.push({
      ...match,
      players,
    })
  }

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
