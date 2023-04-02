import type { JSONSchemaType } from 'ajv'
import omit from 'lodash.omit'
import z from 'zod'
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
export const userCreationDataSchema: JSONSchemaType<UserCreationData> = {
  title: 'User',
  description: 'Data used to create a new user',
  type: 'object',
  properties: omit(userProperties, 'id'),
  required: ['firstName', 'middleAndSurname', 'age', 'email', 'password'],
  additionalProperties: false,
}

export type UserDTO = Omit<User, 'password'>
export const userDTOSchema: JSONSchemaType<UserDTO> = {
  title: 'User',
  description: 'User data',
  type: 'object',
  properties: omit(userProperties, 'password'),
  required: ['id', 'firstName', 'middleAndSurname', 'age', 'email'],
  additionalProperties: false,
}

export const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  middleAndSurname: z.string(),
  age: z.number().min(1).max(120).nullable(),
  email: z.string(),
  password: z.string(),
})

export const zodUserDTOSchema = userSchema
  .omit({
    password: true,
  })
  .strict()
  .describe('Data that represents a user')
