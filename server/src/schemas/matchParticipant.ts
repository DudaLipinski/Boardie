import ajv from './ajv'
import { JSONSchemaType } from 'ajv'
import { GenericFriend, HydratedGenericFriend } from '../controllers/friends'
import { genericFriend, hydratedGenericFriend } from '../schemas/genericFriend'
import omit from 'lodash.omit'

interface MatchParticipantBase {
  id: number
  score: number
  isWinner: boolean
  friend: GenericFriend | HydratedGenericFriend
}
export interface MatchParticipantCreationData
  extends Omit<MatchParticipantBase, 'id'> {
  friend: GenericFriend
}
export type MatchParticipantUpdateData = MatchParticipantCreationData
export interface MatchParticipantDTO extends MatchParticipantBase {
  friend: HydratedGenericFriend
}

const matchParticipantProperties: JSONSchemaType<MatchParticipantBase>['properties'] =
  {
    id: { type: 'number' },
    friend: hydratedGenericFriend,
    score: { type: 'number' },
    isWinner: { type: 'boolean' },
  }
export const matchParticipant: JSONSchemaType<MatchParticipantDTO> = {
  title: 'Match participant',
  description: 'Data that represents an existent match participant',
  type: 'object',
  properties: matchParticipantProperties,
  required: ['id', 'friend', 'score', 'isWinner'],
  additionalProperties: false,
}

const matchParticipantCreationProperties: JSONSchemaType<MatchParticipantCreationData>['properties'] =
  {
    ...omit(matchParticipantProperties, ['id']),
    friend: genericFriend,
  }
export const matchParticipantCreationSchema: JSONSchemaType<MatchParticipantCreationData> =
  {
    title: 'Match participant creation data',
    description: 'Data used to create a match participant',
    type: 'object',
    properties: matchParticipantCreationProperties,
    required: ['friend', 'score', 'isWinner'],
    additionalProperties: false,
  }
export const validateMatchParticipantCreationData = ajv.compile(
  matchParticipantCreationSchema
)

export const matchParticipantUpdateSchema: JSONSchemaType<MatchParticipantUpdateData> =
  matchParticipantCreationSchema
export const validateMatchParticipantUpdateData = ajv.compile(
  matchParticipantUpdateSchema
)
