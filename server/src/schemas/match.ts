import z from 'zod'
import { isoDateString } from '../utils/schemas'
import {
  playerDTOSchema,
  playerCreationDataSchema,
  playerUpdateDataSchema,
} from './player'

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

export const playersCRUDSchema = z
  .object({
    create: z.array(playerCreationDataSchema).optional().nullable(),
    update: z
      .array(playerUpdateDataSchema.extend({ id: z.number() }))
      .optional()
      .nullable(),
    delete: z.array(z.number()).optional().nullable(),
  })
  .optional()
  .nullable()

export const matchUpdateDataSchema = matchSchema
  .omit({
    id: true,
    authorId: true,
    createdAt: true,
    deletedAt: true,
    players: true,
  })
  .extend({
    players: playersCRUDSchema,
  })
  .strict()
  .describe('Match data with its players')
