import type { JSONSchemaType } from 'ajv'
import pick from 'lodash.pick'
import omit from 'lodash.omit'
import type {
  MatchParticipantCreationData,
  MatchParticipantDTO,
} from '../schemas/matchParticipant'
import { matchParticipantDTO } from '../schemas/matchParticipant'
import type { HydratedMatch, Match } from '../models/matches'
import { matchParticipantCreationData } from './matchParticipant'

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
    items: matchParticipantCreationData,
    minItems: 1,
  },
} as const

export type MatchCreationParticipantData = Omit<MatchParticipantDTO, 'fullName'>
export interface MatchCreationData extends Omit<Match, 'id' | 'authorId'> {
  participants: MatchParticipantCreationData[]
}
export const matchCreationData: JSONSchemaType<MatchCreationData> = {
  title: 'Match creation payload',
  description:
    'Data used to create a match along with its initial participants',
  type: 'object',
  properties: omit(matchProperties, ['id', 'authorId']),
  required: ['boardgameName', 'participants'],
  additionalProperties: false,
}

export type MatchDTO = HydratedMatch
export const matchDTO: JSONSchemaType<MatchDTO> = {
  title: 'Match creation result',
  description: 'Match data with its participants',
  type: 'object',
  properties: {
    ...matchProperties,
    participants: {
      type: 'array',
      items: matchParticipantDTO,
    },
  },
  required: ['authorId', 'boardgameName', 'participants'],
  additionalProperties: false,
}

export type MatchUpdateData = Omit<Match, 'id' | 'authorId'>
export const matchUpdateData: JSONSchemaType<MatchUpdateData> = {
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
