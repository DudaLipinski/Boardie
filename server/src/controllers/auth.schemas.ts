import z from 'zod'
import { userSchema, zodUserDTOSchema } from '../schemas/user'

export const authDTOSchema = userSchema
  .pick({
    email: true,
    password: true,
  })
  .strict()
  .describe('Auth information about a user')

export const authSchema = z.object({
  user: zodUserDTOSchema,
  token: z.string(),
})
