import ajv from './ajv'
import { JSONSchemaType } from 'ajv'
import {
  matchParticipant,
  MatchParticipantCreationData,
  MatchParticipantDTO,
} from '../schemas/matchParticipant'
import { HydratedMatch, Match } from '../models/matches'
import { matchParticipantCreationSchema } from './matchParticipant'
import pick from 'lodash.pick'

const matchProperties = {
  id: { type: 'number' },
  authorId: { type: 'number' },
  boardgameName: { type: 'string' },
  location: { type: 'string', nullable: true },
  startedAt: { type: 'string', isoUtcDateTime: true, nullable: true },
  endedAt: { type: 'string', isoUtcDateTime: true, nullable: true },
  notes: { type: 'string', nullable: true },
  participants: {
    type: 'array',
    items: matchParticipantCreationSchema,
    minItems: 1,
  },
} as const

export type MatchCreationParticipantData = Omit<MatchParticipantDTO, 'fullName'>
export interface MatchCreationData extends Omit<Match, 'id'> {
  participants: MatchParticipantCreationData[]
}
const matchCreationDataSchema: JSONSchemaType<MatchCreationData> = {
  title: 'Match creation payload',
  description:
    'Data used to create a match along with its initial participants',
  type: 'object',
  properties: matchProperties,
  required: ['authorId', 'boardgameName', 'participants'],
  additionalProperties: false,
}
export const validateMatchCreationData = ajv.compile(matchCreationDataSchema)

export const matchCreationResultSchema: JSONSchemaType<HydratedMatch> = {
  title: 'Match creation result',
  description: 'Match data with its participants',
  type: 'object',
  properties: {
    ...matchProperties,
    participants: {
      type: 'array',
      items: matchParticipant,
    },
  },
  required: ['authorId', 'boardgameName', 'participants'],
  additionalProperties: false,
}

export type MatchUpdateDTO = Omit<Match, 'id' | 'authorId'>
const matchUpdateSchema: JSONSchemaType<MatchUpdateDTO> = {
  title: 'Match',
  description: 'Match data with its participants',
  type: 'object',
  properties: pick(matchProperties, [
    'boardgameName',
    'location',
    'startedAt',
    'endedAt',
    'notes',
  ]),
  required: ['boardgameName'],
  additionalProperties: false,
}
export const validateMatchUpdateSchema = ajv.compile(matchUpdateSchema)
