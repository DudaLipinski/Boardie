import z from 'zod'

export const userSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  middleAndSurname: z.string(),
  age: z.number().min(1).max(120).nullable(),
  email: z.string().email(),
  password: z.string(),
})

export const userCreationDataSchema = userSchema
  .omit({
    id: true,
  })
  .strict()
  .describe('Data used to create a new user')

export const userDTOSchema = userSchema
  .omit({
    password: true,
  })
  .strict()
  .describe('Data that represents a user')

export const userNameDTOSchema = userSchema
  .pick({
    firstName: true,
    middleAndSurname: true,
  })
  .strict()
  .describe('A user full name')

export type UserCreationData = z.infer<typeof userCreationDataSchema>
export type UserDTO = z.infer<typeof userDTOSchema>
export type UserNameDTO = z.infer<typeof userNameDTOSchema>
