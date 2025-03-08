import z from 'zod'
import { isoDateString } from '../../utils/schema.utils'
import { boardgameDtoSchema } from '../boardgames/boardgames.schema'
import { FriendType } from '../friends/friends.schema'
import {
  playerDTOSchema,
  playerCreationDataSchema,
  playerUpdateDataSchema,
} from './players/players.schema'

const matchSchema = z.object({
  id: z.number(),
  authorId: z.number().nullable(),
  boardgameId: z.number(),
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
    boardgame: z.nullable(boardgameDtoSchema),
  })
  .strict()
  .describe('Match data with its players')

const playersCRUDSchema = z
  .object({
    create: z.array(playerCreationDataSchema),
    update: z.array(playerUpdateDataSchema.extend({ id: z.number() })),
    delete: z.array(z.number()),
  })
  .partial()

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

export const boardgameWinnersSummaryDTOSchema = z.object({
  boardgame: boardgameDtoSchema,
  unknownPlayersWins: z.number(),
  players: z.array(
    z.object({
      id: z.number(),
      type: z.nativeEnum(FriendType),
      wins: z.number(),
    }),
  ),
})

export type MatchDTO = z.infer<typeof matchDTOSchema>
export type MatchCreationData = z.infer<typeof matchCreationDataSchema>
export type MatchUpdateData = z.infer<typeof matchUpdateDataSchema>
export type PlayersCrud = z.infer<typeof playersCRUDSchema>
export type Players = MatchCreationData['players']
export type BoardgameWinnersSummaryDTO = z.infer<
  typeof boardgameWinnersSummaryDTOSchema
>
