import type { ColumnType } from 'kysely'
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>
export type AnonFriend = {
  id: Generated<number>
  fullName: string
  userId: number
}
export type Friendship = {
  smallerUserId: number
  biggerUserId: number
}
export type FriendshipRequest = {
  requestingUserId: number
  requestedUserId: number
}
export type Match = {
  id: Generated<number>
  boardgameName: string
  startedAt: string
  endedAt: string | null
  location: string | null
  notes: string | null
  createdAt: Generated<string>
  deletedAt: string | null
  authorId: number | null
}
export type Player = {
  id: Generated<number>
  score: number | null
  isWinner: number | null
  matchId: number
  userId: number | null
  anonFriendId: number | null
}
export type User = {
  id: Generated<number>
  email: string
  firstName: string
  middleAndSurname: string
  age: number | null
  password: string
  createdAt: Generated<string>
  unregisteredAt: string | null
}
export type DB = {
  anon_friend: AnonFriend
  friendship: Friendship
  friendship_request: FriendshipRequest
  match: Match
  player: Player
  user: User
}
