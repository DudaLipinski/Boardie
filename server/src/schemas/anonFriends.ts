import z from 'zod'

export const anonFriendDTOSchema = z
  .object({
    id: z.number(),
    fullName: z.string(),
    type: z.literal('ANON_FRIEND'),
  })
  .strict()
  .describe('Data that represents an anonymous friend')

export const anonFriendCreationDataSchema = anonFriendDTOSchema
  .pick({
    fullName: true,
  })
  .strict()
  .describe('Data used to create an anonymous friend')

export const anonFriendUpdateDataSchema = anonFriendCreationDataSchema
  .omit({})
  .describe('Data used to update an anonymous friend')
