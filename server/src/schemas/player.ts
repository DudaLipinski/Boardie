import type { JSONSchemaType } from 'ajv'
import omit from 'lodash.omit'
import type {
  HydratedPlayer,
  PlayerUpdateData as DBPlayerUpdateData,
} from '../models/players'
import { FriendType } from '../models/utils'
import type { GenericFriend, HydratedGenericFriend } from './genericFriend'
import { genericFriendSchema, genericFriendDTOSchema } from './genericFriend'

interface PlayerBase {
  id: number
  score: number | null
  isWinner: boolean
  friend: GenericFriend | HydratedGenericFriend
}
export interface PlayerDTO extends PlayerBase {
  friend: HydratedGenericFriend
}

const playerProperties: JSONSchemaType<PlayerBase>['properties'] = {
  id: { type: 'number' },
  friend: genericFriendDTOSchema,
  score: { type: 'number' },
  isWinner: { type: 'boolean' },
}
export const playerDTOSchema: JSONSchemaType<PlayerDTO> = {
  title: 'Player',
  description: 'Data that represents an existent player',
  type: 'object',
  properties: playerProperties,
  required: ['id', 'friend', 'score', 'isWinner'],
  additionalProperties: false,
}

export interface PlayerCreationData extends Omit<PlayerBase, 'id'> {
  friend: GenericFriend
}
const playerCreationProperties: JSONSchemaType<PlayerCreationData>['properties'] =
  {
    ...omit(playerProperties, ['id']),
    friend: genericFriendSchema,
  }
export const playerCreationDataSchema: JSONSchemaType<PlayerCreationData> = {
  title: 'Player creation data',
  description: 'Data used to create a player',
  type: 'object',
  properties: playerCreationProperties,
  required: ['friend', 'score', 'isWinner'],
  additionalProperties: false,
}

export type PlayerUpdateData = PlayerCreationData
export const playerUpdateDataSchema: JSONSchemaType<PlayerUpdateData> =
  playerCreationDataSchema

export const playerDtoToDbModel = (
  player: PlayerCreationData
): DBPlayerUpdateData => ({
  score: player.score,
  isWinner: player.isWinner ? 1 : 0,
  anonFriendId:
    player.friend.type === FriendType.ANON_FRIEND ? player.friend.id : null,
  userId: player.friend.type === FriendType.USER ? player.friend.id : null,
})

export const dbPlayerToDtoModel = (player: HydratedPlayer): PlayerDTO => ({
  id: player.id,
  friend: {
    id: (player.userId ?? player.anonFriendId) as number,
    type: player.userId ? FriendType.USER : FriendType.ANON_FRIEND,
    fullName: player.friendFullName,
  },
  score: player.score,
  isWinner: !!player.isWinner,
})
