import type z from 'zod'
import type { genericFriendIdDTOSchema } from '../schemas/friends'
import { FriendType } from '../schemas/friends'
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
  }

  // return friendsModel.confirmFriendship({ userId, id })
}
