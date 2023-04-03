import z from 'zod'
import { playerDTOSchema } from '../schemas/player'
import { playerCreationDataSchema } from './player'

const matchSchema = z.object({
  id: z.number(),
  authorId: z.number().nullable(),
  boardgameName: z.string(),
  location: z.string().nullable(),
  startedAt: z.string(),
  endedAt: z.string().nullable(),
  createdAt: z.string(),
  deletedAt: z.string().nullable(),
  notes: z.string().nullable(),
  players: z.array(playerCreationDataSchema),
})

export const matchCreationDataSchema = matchSchema
  .omit({
    id: true,
    authorId: true,
    createdAt: true,
    deletedAt: true,
  })
  .strict()
  .describe('Data used to create a match along with its initial players')

export const matchDTOSchema = matchSchema
  .extend({
    players: z.array(playerDTOSchema),
  })
  .strict()
  .describe('Match data with its players')

export const matchUpdateDataSchema = matchSchema
  .omit({
    id: true,
    authorId: true,
    createdAt: true,
    deletedAt: true,
    players: true,
  })
  .strict()
  .describe('Match data with its players')
