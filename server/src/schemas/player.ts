import z from 'zod'
import type {
  HydratedPlayer,
  PlayerUpdateData as DBPlayerUpdateData,
} from '../models/players'
import {
  FriendType,
  genericFriendDTOSchema,
  genericFriendIdDTOSchema,
} from './friends'

const playerSchema = z.object({
  id: z.number(),
  friend: genericFriendDTOSchema,
  score: z.number().nullable(),
  isWinner: z.boolean(),
})
export const playerDTOSchema = playerSchema
  .strict()
  .describe('Data that represents an existent player')

export const playerCreationDataSchema = playerSchema
  .extend({
    friend: genericFriendIdDTOSchema,
  })
  .omit({
    id: true,
  })
  .strict()

export const playerUpdateDataSchema = playerSchema
  .extend({
    friend: genericFriendIdDTOSchema,
  })
  .omit({
    id: true,
  })
  .strict()
  .describe('Data used to update a player')

// export const playerDtoToDbModel = playerDTOSchema.transform<DBPlayerUpdateData>((player) => ({
//   score: player.score,
//   isWinner: player.isWinner ? 1 : 0,
//   anonFriendId:
//     player.friend.type === FriendType.ANON_FRIEND ? player.friend.id : null,
//   userId: player.friend.type === FriendType.USER ? player.friend.id : null,
// }))

export const playerDtoToDbModel = (
  player: z.infer<typeof playerCreationDataSchema>
): DBPlayerUpdateData => ({
  score: player.score,
  isWinner: player.isWinner ? 1 : 0,
  anonFriendId:
    player.friend.type === FriendType.ANON_FRIEND ? player.friend.id : null,
  userId: player.friend.type === FriendType.USER ? player.friend.id : null,
})

export const dbPlayerToDtoModel = (
  player: HydratedPlayer
): z.infer<typeof playerDTOSchema> => ({
  id: player.id,
  friend: {
    id: (player.userId ?? player.anonFriendId) as number,
    type: player.userId ? FriendType.USER : FriendType.ANON_FRIEND,
    fullName: player.friendFullName,
  },
  score: player.score,
  isWinner: !!player.isWinner,
})
