import type { JSONSchemaType } from 'ajv'
import type {
  GenericFriend,
  HydratedGenericFriend,
} from '../controllers/friends'
import { FriendType } from '../models/utils'

const genericFriendProperties: JSONSchemaType<GenericFriend>['properties'] = {
  id: { type: 'number' },
  type: {
    type: 'string',
    enum: [FriendType.USER, FriendType.ANON_FRIEND],
  },
}
export const genericFriend: JSONSchemaType<GenericFriend> = {
  title: 'Generic friend data',
  description: 'Generic friend data',
  type: 'object',
  properties: genericFriendProperties,
  required: ['id', 'type'],
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
