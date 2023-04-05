import type { Transaction } from '../database'
import kysely from '../database'
import { FriendType } from '../schemas/friends'
import { checkFriendshipExists as checkAnonFriendshipExists } from './anonFriends'

interface FriendshipRequest {
  requestingUserId: number
  requestedUserId: number
}
interface Friendship {
  userAId: number
  userBId: number
}

export const createFriendshipRequest = (request: FriendshipRequest) =>
  kysely
    .insertInto('friendship_request')
    .values(request)
    .onConflict((f) => f.doNothing())
    .executeTakeFirst()
    .then((result) => result.numInsertedOrUpdatedRows === 1n)

export const getFriendshipRequests = async (userId: number) =>
  kysely
    .selectFrom('friendship_request')
    .leftJoin('user', 'user.id', 'requestingUserId')
    .select(['user.id as userId', 'user.firstName', 'user.middleAndSurname'])
    .where('requestedUserId', '==', userId)
    .execute()

/**
 * We are doing this ordering to avoid having duplicate friendships
 */
const resolveFriendshipUsers = ({
  requestingUserId,
  requestedUserId,
}: FriendshipRequest): Friendship => ({
  userAId:
    requestingUserId > requestedUserId ? requestedUserId : requestingUserId,
  userBId:
    requestingUserId > requestedUserId ? requestingUserId : requestedUserId,
})

export function deleteRequest(
  this: { transaction?: Transaction },
  { requestingUserId, requestedUserId }: FriendshipRequest
) {
  return (this.transaction ?? kysely)
    .deleteFrom('friendship_request')
    .where('requestedUserId', '==', requestedUserId)
    .where('requestingUserId', '==', requestingUserId)
    .executeTakeFirst()
    .then((result) => result.numDeletedRows > 0)
}

export function createFriendship(
  this: { transaction?: Transaction },
  request: FriendshipRequest
) {
  return (this.transaction ?? kysely)
    .insertInto('friendship')
    .values([resolveFriendshipUsers(request)])
    .onConflict((f) => f.doNothing())
    .executeTakeFirst()
    .then((result) => result.numInsertedOrUpdatedRows === 1n)
}

export const getAllByUserId = async (userId: number) => {
  const usersA = await kysely
    .selectFrom('friendship')
    .leftJoin('user', 'user.id', 'userBId')
    .select(['user.id', 'user.firstName', 'user.middleAndSurname'])
    .where('userAId', '==', userId)
    .execute()

  const usersB = await kysely
    .selectFrom('friendship')
    .leftJoin('user', 'user.id', 'userAId')
    .select(['user.id', 'user.firstName', 'user.middleAndSurname'])
    .where('userBId', '==', userId)
    .execute()

  return [...usersA, ...usersB]
}

export const checkFriendshipExists = ({
  userId,
  id,
}: {
  userId: number
  id: number
}) =>
  kysely
    .selectFrom('friendship')
    .select('userAId')
    .where((qb) => qb.where('userAId', '==', userId).where('userBId', '==', id))
    .orWhere((qb) =>
      qb.where('userAId', '==', id).where('userBId', '==', userId)
    )
    .limit(1)
    .executeTakeFirst()
    .then((result) => result?.userAId !== undefined)

export const genericCheckFriendshipExistsWith = async (
  userId: number,
  friendId: number,
  friendType: FriendType
) => {
  if (friendType === FriendType.ANON_FRIEND) {
    const friendshipExists = await checkAnonFriendshipExists({
      userId,
      id: friendId,
    })
    if (!friendshipExists) {
      return false
    }

    return true
  }

  const friendExists = await checkFriendshipExists({
    id: friendId,
    userId,
  })
  if (!friendExists) {
    return false
  }

  return true
}
