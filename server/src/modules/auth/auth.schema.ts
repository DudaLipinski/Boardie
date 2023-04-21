import z from 'zod'
import { userSchema, userDTOSchema } from '../users/users.schema'

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

export type AuthDTO = z.infer<typeof authDTOSchema>
export type Auth = z.infer<typeof authSchema>
