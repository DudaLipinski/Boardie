import ajv from './ajv'
import { JSONSchemaType } from 'ajv'
import { AnonFriend } from '../models/anonFriends'

export type AnonFriendCreationDTO = Omit<AnonFriend, 'id'>
const anonFriendCreationSchema: JSONSchemaType<AnonFriendCreationDTO> = {
  title: 'Anonymous friend creation data',
  description: 'Data used to create an anonymous friend',
  type: 'object',
  properties: {
    userId: { type: 'number' },
    fullName: { type: 'string' },
  },
  required: ['userId', 'fullName'],
  additionalProperties: false,
}

export const validateAnonFriendCreationSchema = ajv.compile(
  anonFriendCreationSchema
)
