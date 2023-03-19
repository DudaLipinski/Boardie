import type { GenericFriend } from '../controllers/friends'
import * as anonFriendsModel from './anonFriends'
import { FriendType } from './utils'

export const checkFriendshipExists = ({
  userId,
  friend,
}: {
  userId: number
  friend: GenericFriend
}) => {
  const { id, type } = friend
  if (type === FriendType.ANON_FRIEND) {
    return anonFriendsModel.checkFriendshipExists({ userId, id })
  }

  // return friendsModel.confirmFriendship({ userId, id })
}
