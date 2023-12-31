import type { Transaction } from '../../../database'
import kysely from '../../../database'

export interface AnonFriend {
  id: number
  fullName: string
  userId: number
}

export const create = (anonFriend: Omit<AnonFriend, 'id'>) =>
  kysely
    .insertInto('anon_friend')
    .values(anonFriend)
    .returning('id')
    .executeTakeFirstOrThrow()

export const getById = (id: number) => {
  return kysely
    .selectFrom('anon_friend')
    .selectAll()
    .where('id', '==', id)
    .limit(1)
    .executeTakeFirst()
}

export const update = (
  id: AnonFriend['id'],
  params: { fullName: AnonFriend['fullName'] }
) => {
  return kysely
    .updateTable('anon_friend')
    .set(params)
    .where('id', '==', id)
    .executeTakeFirst()
    .then((result) => result.numUpdatedRows === 1n)
}

export const deleteById = (id: AnonFriend['id'], transaction?: Transaction) =>
  (transaction ?? kysely)
    .deleteFrom('anon_friend')
    .where('id', '==', id)
    .executeTakeFirst()
    .then((result) => result.numDeletedRows === 1n)

export const getAllByUserId = (userId: number) =>
  kysely
    .selectFrom('anon_friend')
    .select(['id', 'fullName'])
    .where('userId', '==', userId)
    .execute()

export const checkFriendshipExists = async (params: {
  userId: number
  id: number
}) =>
  kysely
    .selectFrom('anon_friend')
    .select('id')
    .where('userId', '==', params.userId)
    .where('id', '==', params.id)
    .limit(1)
    .executeTakeFirst()
    .then((result) => result !== undefined)
