import { Dayjs } from 'dayjs'
import { GenericUser } from './GenericUser'
export interface Participant {
  score?: number
  isWinner?: boolean
  friend: GenericUser
}
export interface Match {
  id: string
  authorId: string
  boardgameName: string
  startedAt: Dayjs | string
  endedAt: Dayjs | string
  notes: string
  participants: Participant[]
}
