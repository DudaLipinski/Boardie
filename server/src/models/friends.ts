import type z from 'zod'
import type { genericFriendIdDTOSchema } from '../schemas/friends'
import { FriendType } from '../schemas/friends'
import kysely from '../database'
import * as anonFriendsModel from './anonFriends'

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

export const createFriendshipRequest = (request: {
  requestingUserId: number
  requestedUserId: number
}) =>
  kysely
    .insertInto('friendship_request')
    .values(request)
    .onConflict((f) => f.doNothing())
    .executeTakeFirst()
    .then((result) => result.numInsertedOrUpdatedRows === 1n)
