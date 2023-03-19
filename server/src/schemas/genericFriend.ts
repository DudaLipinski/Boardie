import type { JSONSchemaType } from 'ajv'
import { FriendType } from '../models/utils'

export interface GenericFriend {
  id: number
  type: FriendType
}
const genericFriendProperties = {
  id: { type: 'number' },
  type: {
    type: 'string',
    enum: [FriendType.USER, FriendType.ANON_FRIEND],
  },
} as const

export interface HydratedGenericFriend extends GenericFriend {
  fullName: string
}
export const genericFriendDTO: JSONSchemaType<HydratedGenericFriend> = {
  title: 'Hydrated generic friend',
  description: 'Friend data with its full name',
  type: 'object',
  properties: {
    ...genericFriendProperties,
    fullName: { type: 'string' },
  },
  required: ['id', 'type', 'fullName'],
  additionalProperties: false,
}

export const genericFriend: JSONSchemaType<GenericFriend> = {
  title: 'Generic friend data',
  description: 'Generic friend data',
  type: 'object',
  properties: genericFriendProperties,
  required: ['id', 'type'],
}
