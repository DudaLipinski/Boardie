export interface FriendshipRequest {
  userId: number
  fullName: string
}

export type AnonFriendInviteTokenData = {
  invitingUser: { firstName: string; middleAndSurname: string }
  anonFriendFullName: string
}
