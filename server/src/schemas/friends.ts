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

export const friendshipRequestSchema = z
  .object({
    userEmail: z.string().email(),
    userId: z.number(),
  })
  .partial()
  .refine(
    (data) => data.userEmail || data.userId,
    'You must provide at least an userEmail or a userId'
  )
  .refine(
    (data) => !(data.userEmail && data.userId),
    'You must provide only an userEmail, or an userId, not both'
  )
  .describe('Data used to send a friendship request')

export const acceptFriendshipRequestSchema = z
  .object({
    userId: z.number(),
  })
  .describe('Data used to accept a friendship request')

export const existentFriendshipRequestSchema = z.object({
  userId: z.number(),
  fullName: z.string(),
})
