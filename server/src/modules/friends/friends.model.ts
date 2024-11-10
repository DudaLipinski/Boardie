import type { Transaction } from '../../database'
import kysely from '../../database'
import { FriendType } from './friends.schema'
import { checkFriendshipExists as checkAnonFriendshipExists } from './anonFriends/anonFriends.model'

interface FriendshipRequest {
  requestingUserId: number
  requestedUserId: number
}
type Friendship = [number, number]
interface OrderedFriendship {
  smallerUserId: number
  biggerUserId: number
}

export const createFriendshipRequest = (request: FriendshipRequest) =>
  kysely
    .insertInto('friendship_request')
    .ignore()
    .values(request)
    .executeTakeFirst()
    .then((result) => result.numInsertedOrUpdatedRows === 1n)

export const getFriendshipRequests = async (userId: number) =>
  kysely
    .selectFrom('friendship_request')
    .leftJoin('user', 'user.id', 'requestingUserId')
    .select(['user.id as userId', 'user.firstName', 'user.middleAndSurname'])
    .where('requestedUserId', '=', userId)
    .execute()

export const deleteRequest = (
  { requestingUserId, requestedUserId }: FriendshipRequest,
  transaction?: Transaction,
) => {
  return (transaction ?? kysely)
    .deleteFrom('friendship_request')
    .where('requestedUserId', '=', requestedUserId)
    .where('requestingUserId', '=', requestingUserId)
    .executeTakeFirst()
    .then((result) => result.numDeletedRows > 0)
}

/**
 * We are doing this ordering to avoid having duplicate friendships,
 * and also the need to search twice for friendships ([A, B] and [B, A])
 */
const getOrderedFriendship = ([
  userAId,
  userBId,
]: Friendship): OrderedFriendship => ({
  smallerUserId: userAId > userBId ? userBId : userAId,
  biggerUserId: userAId > userBId ? userAId : userBId,
})

export const createFriendship = (
  request: Friendship,
  transaction: Transaction,
) => {
  return (transaction ?? kysely)
    .insertInto('friendship')
    .ignore()
    .values([getOrderedFriendship(request)])
    .executeTakeFirst()
    .then((result) => result.numInsertedOrUpdatedRows === 1n)
}

export const getAllByUserId = async (userId: number) => {
  const usersA = await kysely
    .selectFrom('friendship')
    .leftJoin('user', 'user.id', 'biggerUserId')
    .select(['user.id', 'user.firstName', 'user.middleAndSurname'])
    .where('smallerUserId', '=', userId)
    .execute()

  const usersB = await kysely
    .selectFrom('friendship')
    .leftJoin('user', 'user.id', 'smallerUserId')
    .select(['user.id', 'user.firstName', 'user.middleAndSurname'])
    .where('biggerUserId', '=', userId)
    .execute()

  return [...usersA, ...usersB]
}

export const checkFriendshipExists = (friendship: Friendship) => {
  const { smallerUserId, biggerUserId } = getOrderedFriendship(friendship)

  return kysely
    .selectFrom('friendship')
    .select('smallerUserId')
    .where('smallerUserId', '=', smallerUserId)
    .where('biggerUserId', '=', biggerUserId)
    .limit(1)
    .executeTakeFirst()
    .then((result) => result?.smallerUserId !== undefined)
}

export const genericCheckFriendshipExistsWith = async (
  userId: number,
  friendId: number,
  friendType: FriendType,
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

  const friendExists = await checkFriendshipExists([userId, friendId])
  if (!friendExists) {
    return false
  }

  return true
}

export const deleteFriendship = async (friendship: Friendship) => {
  const { smallerUserId, biggerUserId } = getOrderedFriendship(friendship)

  return kysely
    .deleteFrom('friendship')
    .where('smallerUserId', '=', smallerUserId)
    .where('biggerUserId', '=', biggerUserId)
    .executeTakeFirst()
    .then((result) => result.numDeletedRows > 0)
}
