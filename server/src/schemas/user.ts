import ajv from './ajv'
import { JSONSchemaType } from 'ajv'
import { User } from '../models/user'

const schema: JSONSchemaType<Omit<User, 'id'>> = {
  title: 'User',
  description: 'Contact and auth information about a user',
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    middleAndSurname: { type: 'string' },
    age: { type: 'integer', minimum: 1, maximum: 120 },
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['firstName', 'middleAndSurname', 'age', 'email', 'password'],
  additionalProperties: false,
}

export default ajv.compile(schema)
