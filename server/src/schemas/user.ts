import type { JSONSchemaType } from 'ajv'
import omit from 'lodash.omit'
import type { User } from '../models/user'

const userProperties = {
  id: { type: 'number' },
  firstName: { type: 'string' },
  middleAndSurname: { type: 'string' },
  age: { type: 'integer', minimum: 1, maximum: 120 },
  email: { type: 'string' },
  password: { type: 'string' },
} as const

export type UserCreationData = Omit<User, 'id'>
export const userCreationData: JSONSchemaType<UserCreationData> = {
  title: 'User',
  description: 'Data used to create a new user',
  type: 'object',
  properties: omit(userProperties, 'id'),
  required: ['firstName', 'middleAndSurname', 'age', 'email', 'password'],
  additionalProperties: false,
}

export type UserDTO = Omit<User, 'password'>
export const userDTO: JSONSchemaType<UserDTO> = {
  title: 'User',
  description: 'User data',
  type: 'object',
  properties: omit(userProperties, 'password'),
  required: ['id', 'firstName', 'middleAndSurname', 'age', 'email'],
  additionalProperties: false,
}
