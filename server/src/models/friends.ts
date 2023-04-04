import type z from 'zod'
import type { genericFriendIdDTOSchema } from '../schemas/friends'
import { FriendType } from '../schemas/friends'
import kysely from '../database'
import * as anonFriendsModel from './anonFriends'

interface FriendshipRequest {
  requestingUserId: number
  requestedUserId: number
}
interface Friendship {
  userAId: number
  userBId: number
}

export const checkFriendshipExists = ({
  userId,
  friend,
}: {
  userId: number
  friend: z.infer<typeof genericFriendIdDTOSchema>
}) => {
  const { id, type } = friend
  if (type === FriendType.ANON_FRIEND) {
    return anonFriendsModel.checkFriendshipExists({ userId, id })
  } else {
    return id === userId
  }

  // return friendsModel.confirmFriendship({ userId, id })
}

export const createFriendshipRequest = (request: FriendshipRequest) =>
  kysely
    .insertInto('friendship_request')
    .values(request)
    .onConflict((f) => f.doNothing())
    .executeTakeFirst()
    .then((result) => result.numInsertedOrUpdatedRows === 1n)

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

export const acceptRequest = (request: FriendshipRequest) => {
  const { requestingUserId, requestedUserId } = request

  return kysely.transaction().execute(async (tx) => {
    const requestExists = await tx
      .deleteFrom('friendship_request')
      .where((qb) =>
        qb
          .where('requestedUserId', '==', requestedUserId)
          .where('requestingUserId', '==', requestingUserId)
      )
      .orWhere((qb) =>
        qb
          .where('requestedUserId', '==', requestingUserId)
          .where('requestingUserId', '==', requestedUserId)
      )
      .executeTakeFirst()
      .then((result) => result.numDeletedRows > 0)
    if (!requestExists) {
      return false
    }

    return tx
      .insertInto('friendship')
      .values([resolveFriendshipUsers(request)])
      .onConflict((f) => f.doNothing())
      .execute()
  })
}
