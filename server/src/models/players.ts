import { sql } from 'kysely'
import type { Transaction } from '../database'
import kysely from '../database'
import { FriendType } from '../schemas/friends'

export interface Player {
  id: number
  matchId: number
  userId?: number | null
  anonFriendId?: number | null
  score: number | null
  isWinner: number | null
}
export interface HydratedPlayer extends Player {
  friendFullName: string
}
type PlayerCreationData = Omit<Player, 'id'>
export type PlayerUpdateData = Omit<Player, 'id' | 'matchId'>

const dbPlayerToDtoModel = (player: HydratedPlayer) => ({
  id: player.id,
  friend: {
    id: (player.userId ?? player.anonFriendId) as number,
    type: player.userId ? FriendType.USER : FriendType.ANON_FRIEND,
    fullName: player.friendFullName,
  },
  score: player.score,
  isWinner: !!player.isWinner,
})

const queryHydrated = kysely
  .selectFrom('player')
  .leftJoin('user', 'player.userId', 'user.id')
  .leftJoin('anon_friend', 'player.anonFriendId', 'anon_friend.id')
  .selectAll('player')
  .select(
    sql<string>`
      IIF(
        player.userId IS NULL,
        anon_friend.fullName,
        user.firstName || ' ' || user.middleAndSurname
      )
    `.as('friendFullName')
  )

export const getById = ({ id }: { id: number }) =>
  queryHydrated
    .where('player.id', '==', id)
    .executeTakeFirst()
    .then(
      (player) => (player ? dbPlayerToDtoModel(player) : null) // TODO: separate dbPlayerToDtoModel
    )

export const getAllByMatchId = (params: { matchId: number }) =>
  queryHydrated
    .where('player.matchId', '==', params.matchId)
    .execute()
    .then((players) => players.map(dbPlayerToDtoModel)) // TODO: separate dbPlayerToDtoModel

export function createMultiple(
  this: { transaction?: Transaction },
  players: PlayerCreationData[]
) {
  return (this.transaction ?? kysely)
    .insertInto('player')
    .values(players)
    .execute()
}

export const create = (player: PlayerCreationData) =>
  kysely
    .insertInto('player')
    .values(player)
    .returningAll()
    .execute()
    .then((rows) => getById({ id: rows[0]?.id }))

export function update(
  {
    id,
    player,
  }: {
    id: number
    player: PlayerUpdateData
  },
  transaction?: Transaction
) {
  return (transaction ?? kysely)
    .updateTable('player')
    .set(player)
    .where('id', '==', id)
    .executeTakeFirst()
    .then((result) => result.numUpdatedRows !== 1n)
}

export const deleteMultiple = (
  params: { ids: number[] },
  transaction?: Transaction
) =>
  (transaction ?? kysely)
    .deleteFrom('player')
    .where('id', 'in', params.ids)
    .execute()

export const deleteById = (params: { id: number; matchId: number }) =>
  kysely
    .deleteFrom('player')
    .where('id', '==', params.id)
    .where('matchId', '==', params.matchId)
    .executeTakeFirst()
    .then((result) => result.numDeletedRows === 1n)

export const checkIfExists = async (params: { id: number }) =>
  kysely
    .selectFrom('player')
    .select(['id'])
    .where('id', '==', params.id)
    .executeTakeFirst()
    .then((result) => !!result)
