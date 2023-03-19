import type { JSONSchemaType } from 'ajv'
import omit from 'lodash.omit'
import type {
  GenericFriend,
  HydratedGenericFriend,
} from '../controllers/friends'
import { genericFriend, genericFriendDTO } from '../schemas/genericFriend'

interface MatchParticipantBase {
  id: number
  score: number
  isWinner: boolean
  friend: GenericFriend | HydratedGenericFriend
}
export interface MatchParticipantDTO extends MatchParticipantBase {
  friend: HydratedGenericFriend
}

const matchParticipantProperties: JSONSchemaType<MatchParticipantBase>['properties'] =
  {
    id: { type: 'number' },
    friend: genericFriendDTO,
    score: { type: 'number' },
    isWinner: { type: 'boolean' },
  }
export const matchParticipantDTO: JSONSchemaType<MatchParticipantDTO> = {
  title: 'Match participant',
  description: 'Data that represents an existent match participant',
  type: 'object',
  properties: matchParticipantProperties,
  required: ['id', 'friend', 'score', 'isWinner'],
  additionalProperties: false,
}

export interface MatchParticipantCreationData
  extends Omit<MatchParticipantBase, 'id'> {
  friend: GenericFriend
}
const matchParticipantCreationProperties: JSONSchemaType<MatchParticipantCreationData>['properties'] =
  {
    ...omit(matchParticipantProperties, ['id']),
    friend: genericFriend,
  }
export const matchParticipantCreationData: JSONSchemaType<MatchParticipantCreationData> =
  {
    title: 'Match participant creation data',
    description: 'Data used to create a match participant',
    type: 'object',
    properties: matchParticipantCreationProperties,
    required: ['friend', 'score', 'isWinner'],
    additionalProperties: false,
  }

export type MatchParticipantUpdateData = MatchParticipantCreationData
export const matchParticipantUpdateData: JSONSchemaType<MatchParticipantUpdateData> =
  matchParticipantCreationData
