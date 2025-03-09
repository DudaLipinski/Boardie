import { sql } from 'kysely'
import type { Transaction } from '../../../database'
import kysely from '../../../database'
import { FriendType } from '../../friends/friends.schema'

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
  matchId: player.matchId,
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

export const getAllByMatchId = (params: { matchId: number | number[] }) =>
  queryHydrated
    .$if(Array.isArray(params.matchId), (query) =>
      query.where('player.matchId', 'in', params.matchId)
    )
    .$if(!Array.isArray(params.matchId), (query) =>
      query.where('player.matchId', '==', params.matchId)
    )
    .execute()
    .then((players) => players.map(dbPlayerToDtoModel)) // TODO: separate dbPlayerToDtoModel

export const createMultiple = (
  players: PlayerCreationData[],
  transaction?: Transaction
) => (transaction ?? kysely).insertInto('player').values(players).execute()

export const create = (player: PlayerCreationData) =>
  kysely
    .insertInto('player')
    .values(player)
    .returningAll()
    .execute()
    .then((rows) => getById({ id: rows[0]?.id }))

export const update = (
  {
    id,
    player,
  }: {
    id: number
    player: PlayerUpdateData
  },
  transaction?: Transaction
) =>
  (transaction ?? kysely)
    .updateTable('player')
    .set(player)
    .where('id', '==', id)
    .executeTakeFirst()
    .then((result) => result.numUpdatedRows !== 1n)

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

export const checkIfExists = (params: { id: number }) =>
  kysely
    .selectFrom('player')
    .select(['id'])
    .where('id', '==', params.id)
    .executeTakeFirst()
    .then((result) => !!result)

export const transferAllFromAnonFriendToUser = (
  params: {
    userId: number
    anonFriendId: number
  },
  transaction?: Transaction
) =>
  (transaction ?? kysely)
    .updateTable('player')
    .set({ userId: params.userId, anonFriendId: null })
    .where('anonFriendId', '==', params.anonFriendId)
    .execute()
