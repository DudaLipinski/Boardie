import dayjs from 'dayjs'
import { MatchCreationData } from '../matches.schema'

const creationData = (
  players: MatchCreationData['players'],
  overrides: Omit<Partial<MatchCreationData>, 'players'> = {},
): MatchCreationData => ({
  players,
  boardgameId: 1,
  startedAt: dayjs().toISOString(),
  location: null,
  notes: null,
  endedAt: null,
  ...overrides,
})

export const matchesSchemaMocks = {
  creationData,
}
