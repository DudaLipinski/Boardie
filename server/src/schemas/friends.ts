import z from 'zod'

export enum FriendType {
  ANON_FRIEND = 'ANON_FRIEND',
  USER = 'USER',
}

const genericFriendSchema = z.object({
  id: z.number(),
  type: z.nativeEnum(FriendType),
  fullName: z.string(),
})

export const genericFriendDTOSchema = genericFriendSchema
  .strict()
  .describe('Generic friend')

export const genericFriendIdDTOSchema = genericFriendSchema
  .omit({
    fullName: true,
  })
  .strict()
  .describe('Generic friend identification data')
