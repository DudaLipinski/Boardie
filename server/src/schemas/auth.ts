import type { JSONSchemaType } from 'ajv'
import pick from 'lodash.pick'
import type { User } from '../models/user'

export const userProperties = {
  id: { type: 'string' },
  firstName: { type: 'string' },
  middleAndSurname: { type: 'string' },
  age: { type: 'integer', minimum: 1, maximum: 120 },
  email: { type: 'string' },
  password: { type: 'string' },
} as const

export const userAuthDTOSchema: JSONSchemaType<
  Pick<User, 'email' | 'password'>
> = {
  title: 'auth',
  description: 'Auth information about a user',
  type: 'object',
  properties: pick(userProperties, ['email', 'password']),
  required: ['email', 'password'],
  additionalProperties: false,
} as const

export type AuthData = Pick<User, 'email' | 'password'>
export const authDataSchema: JSONSchemaType<AuthData> = {
  title: 'auth',
  description: 'Contact and auth information about a user',
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  additionalProperties: false,
}
