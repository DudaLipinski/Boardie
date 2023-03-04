import ajv from './ajv'
import { JSONSchemaType } from 'ajv'
import { User } from '../models/user'

const authSchema: JSONSchemaType<Pick<User, 'email' | 'password'>> = {
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

export const validateAuthSchema = ajv.compile(authSchema)
