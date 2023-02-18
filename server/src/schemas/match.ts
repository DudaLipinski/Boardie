import ajv from './ajv'
import { JSONSchemaType } from 'ajv'
import { MatchParticipant } from '../models/matchParticipant'
import { Match } from '../models/matches'

export interface MatchResponseDTO extends Match {
  participants: Omit<MatchParticipant, 'matchId'>[]
}

export type MatchCreationParticipantData = Omit<
  MatchParticipant,
  'id' | 'matchId'
>

export interface MatchCreationDTO extends Omit<Match, 'id' | 'authorId'> {
  participants: MatchCreationParticipantData[]
}

export type MatchCreationData = MatchCreationDTO & {
  authorId: Match['authorId']
}

const matchCreationSchema: JSONSchemaType<MatchCreationData> = {
  title: 'Match',
  description: 'Match data with its participants',
  type: 'object',
  properties: {
    authorId: { type: 'number' },
    boardgameName: { type: 'string' },
    date: { type: 'string', nullable: true },
    duration: { type: 'number', nullable: true },
    notes: { type: 'string', nullable: true },
    participants: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          fullName: { type: 'string' },
          score: { type: 'number' },
        },
        required: ['fullName', 'score'],
      },
    },
  },
  required: ['authorId', 'boardgameName', 'participants'],
  additionalProperties: false,
}
export const validateMatchCreationSchema = ajv.compile(matchCreationSchema)
