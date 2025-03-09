import { Dayjs } from 'dayjs'
import { GenericUser } from './GenericUser'
import type { Boardgame } from './Boardgame'
export interface Player {
  id?: number
  score?: number
  isWinner?: boolean
  friend: GenericUser
}
export interface Match {
  id: number
  authorId: string
  boardgame: Boardgame
  startedAt: Dayjs | string
  endedAt: Dayjs | string | null
  notes: string
  players: Player[]
}
