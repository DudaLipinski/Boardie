import ajv from './ajv'
import { JSONSchemaType } from 'ajv'
import { FriendType } from '../models/utils'
import { GenericFriend, HydratedGenericFriend } from '../controllers/friends'
import pick from 'lodash.pick'

export interface MatchParticipantCreationPayloadDTO {
  friend: GenericFriend
  score: number
  isWinner: boolean
}
export interface MatchParticipantDTO {
  id: number
  friend: HydratedGenericFriend
  score: number
  isWinner: boolean
}

const matchParticipantProperties = {
  id: { type: 'number' },
  friend: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      type: {
        type: 'string',
        enum: [FriendType.USER, FriendType.ANON_FRIEND],
      },
    },
    required: ['id', 'type'],
  },
  score: { type: 'number' },
  isWinner: { type: 'boolean' },
} as const

export const participantCreationSchema: JSONSchemaType<MatchParticipantCreationPayloadDTO> =
  {
    title: 'Match participant creation data',
    description: 'Data used to create a match participant',
    type: 'object',
    properties: pick(matchParticipantProperties, [
      'friend',
      'score',
      'isWinner',
    ]),
    required: ['friend', 'score', 'isWinner'],
    additionalProperties: false,
  }
export const validateParticipantCreationSchema = ajv.compile(
  participantCreationSchema
)
