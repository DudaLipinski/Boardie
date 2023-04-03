import type { JSONSchemaType } from 'ajv'
import pick from 'lodash.pick'
import omit from 'lodash.omit'
import type { PlayerCreationData, PlayerDTO } from '../schemas/player'
import { playerDTOSchema } from '../schemas/player'
import type { HydratedMatch, Match } from '../models/matches'
import { playerCreationDataSchema } from './player'

const matchProperties = {
  id: { type: 'number' },
  authorId: { type: 'number' },
  boardgameName: { type: 'string' },
  location: { type: 'string', nullable: true },
  startedAt: { type: 'string', isoUtcDateTime: true, nullable: false },
  endedAt: { type: 'string', isoUtcDateTime: true, nullable: true },
  createdAt: { type: 'string', isoUtcDateTime: true, nullable: false },
  deletedAt: { type: 'string', isoUtcDateTime: true, nullable: true },
  notes: { type: 'string', nullable: true },
  players: {
    type: 'array',
    items: playerCreationDataSchema,
    minItems: 1,
  },
} as const

export type MatchCreationPlayerData = Omit<PlayerDTO, 'fullName'>
export interface MatchCreationData extends Omit<Match, 'id' | 'authorId'> {
  players: PlayerCreationData[]
}
export const matchCreationDataSchema: JSONSchemaType<MatchCreationData> = {
  title: 'Match creation payload',
  description: 'Data used to create a match along with its initial players',
  type: 'object',
  properties: omit(matchProperties, ['id', 'authorId']),
  required: ['boardgameName', 'players'],
  additionalProperties: false,
}

export type MatchDTO = HydratedMatch
export const matchDTOSchema: JSONSchemaType<MatchDTO> = {
  title: 'Match creation result',
  description: 'Match data with its players',
  type: 'object',
  properties: {
    ...matchProperties,
    players: {
      type: 'array',
      items: playerDTOSchema,
    },
  },
  required: ['authorId', 'boardgameName', 'players'],
  additionalProperties: false,
}

export type MatchUpdateData = Omit<Match, 'id' | 'authorId'>
export const matchUpdateDataSchema: JSONSchemaType<MatchUpdateData> = {
  title: 'Match',
  description: 'Match data with its players',
  type: 'object',
  properties: pick(matchProperties, [
    'boardgameName',
    'location',
    'startedAt',
    'endedAt',
    'notes',
    'createdAt',
    'deletedAt',
  ]),
  required: ['boardgameName'],
  additionalProperties: false,
}
