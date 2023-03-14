import ajv from './ajv'
import { JSONSchemaType } from 'ajv'
import { AnonFriend } from '../models/anonFriends'
import pick from 'lodash.pick'

export interface AnonFriendDTO {
  id: AnonFriend['id']
  fullName: AnonFriend['fullName']
  type: 'ANON_FRIEND'
}

const anonFriendProperties = {
  id: { type: 'number' },
  fullName: { type: 'string' },
  type: { type: 'string', enum: ['ANON_FRIEND'] },
} as const

export type AnonFriendCreationData = Omit<AnonFriendDTO, 'id' | 'type'>
const anonFriendCreationSchema: JSONSchemaType<AnonFriendCreationData> = {
  title: 'Anonymous friend creation data',
  description: 'Data used to create an anonymous friend',
  type: 'object',
  properties: pick(anonFriendProperties, ['fullName']),
  required: ['fullName'],
  additionalProperties: false,
}
export const validateAnonFriendCreationSchema = ajv.compile(
  anonFriendCreationSchema
)

export type AnonFriendUpdateData = AnonFriendCreationData
const anonFriendUpdateSchema: JSONSchemaType<AnonFriendUpdateData> = {
  title: 'Anonymous friend update data',
  description: 'Data used to update an anonymous friend',
  type: 'object',
  properties: pick(anonFriendProperties, ['fullName']),
  required: ['fullName'],
  additionalProperties: false,
}
export const validateAnonFriendUpdateSchema = ajv.compile(
  anonFriendUpdateSchema
)
