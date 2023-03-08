import ajv from './ajv'
import { JSONSchemaType } from 'ajv'
import {
  MatchParticipantCreationPayloadDTO,
  MatchParticipantDTO,
} from '../schemas/matchParticipant'
import { Match } from '../models/matches'
import { participantCreationSchema } from './matchParticipant'
import pick from 'lodash.pick'

const matchProperties = {
  authorId: { type: 'number' },
  boardgameName: { type: 'string' },
  location: { type: 'string', nullable: true },
  startedAt: { type: 'string', isoUtcDateTime: true, nullable: true },
  endedAt: { type: 'string', isoUtcDateTime: true, nullable: true },
  notes: { type: 'string', nullable: true },
  participants: {
    type: 'array',
    items: participantCreationSchema,
  },
} as const

export type MatchCreationParticipantData = Omit<MatchParticipantDTO, 'fullName'>
export interface MatchCreationPayloadDTO extends Omit<Match, 'id'> {
  participants: MatchParticipantCreationPayloadDTO[]
}
const matchCreationSchema: JSONSchemaType<MatchCreationPayloadDTO> = {
  title: 'Match creation payload',
  description:
    'Data used to create a match along with its initial participants',
  type: 'object',
  properties: matchProperties,
  required: ['authorId', 'boardgameName', 'participants'],
  additionalProperties: false,
}
export const validateMatchCreationSchema = ajv.compile(matchCreationSchema)

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
