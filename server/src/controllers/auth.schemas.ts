import z from 'zod'
import { userSchema, userDTOSchema } from './user.schemas'

export const authDTOSchema = userSchema
  .pick({
    email: true,
    password: true,
  })
  .strict()
  .describe('Auth information about a user')

export const authSchema = z.object({
  user: userDTOSchema,
  token: z.string(),
})
