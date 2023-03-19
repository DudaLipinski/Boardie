import type { JSONSchemaType } from 'ajv'
import pick from 'lodash.pick'
import type { AnonFriend } from '../models/anonFriends'

const anonFriendProperties = {
  id: { type: 'number' },
  fullName: { type: 'string' },
  type: { type: 'string', enum: ['ANON_FRIEND'] },
} as const

export interface AnonFriendDTO {
  id: AnonFriend['id']
  fullName: AnonFriend['fullName']
  type: 'ANON_FRIEND'
}
export const anonFriendDTO: JSONSchemaType<AnonFriendDTO> = {
  title: 'Anonymous friend',
  description: 'Data that represents an anonymous friend',
  type: 'object',
  properties: anonFriendProperties,
  required: ['id', 'fullName', 'type'],
  additionalProperties: false,
}

export type AnonFriendCreationData = Omit<AnonFriendDTO, 'id' | 'type'>
export const anonFriendCreationData: JSONSchemaType<AnonFriendCreationData> = {
  title: 'Anonymous friend creation data',
  description: 'Data used to create an anonymous friend',
  type: 'object',
  properties: pick(anonFriendProperties, ['fullName']),
  required: ['fullName'],
  additionalProperties: false,
}

export type AnonFriendUpdateData = AnonFriendCreationData
export const anonFriendUpdateData: JSONSchemaType<AnonFriendUpdateData> = {
  title: 'Anonymous friend update data',
  description: 'Data used to update an anonymous friend',
  type: 'object',
  properties: pick(anonFriendProperties, ['fullName']),
  required: ['fullName'],
  additionalProperties: false,
}
