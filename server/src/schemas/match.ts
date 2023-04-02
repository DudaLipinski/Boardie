import z from 'zod'
import { playerDTOSchema, playerUpdateDataSchema } from '../schemas/player'
import { isoDateString } from '../utils/schemas'
import { playerCreationDataSchema } from './player'

const matchSchema = z.object({
  id: z.number(),
  authorId: z.number().nullable(),
  boardgameName: z.string(),
  location: z.string().nullable(),
  startedAt: isoDateString(),
  endedAt: isoDateString().nullable(),
  createdAt: isoDateString(),
  deletedAt: isoDateString().nullable(),
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
  .extend({
    players: z
      .object({
        create: z.array(playerCreationDataSchema),
        update: z.array(playerUpdateDataSchema),
        delete: z.array(z.number()),
      })
      .optional(),
  })
  .strict()
  .describe('Match data with its players')
