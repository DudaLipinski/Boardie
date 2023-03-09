import { Dayjs } from 'dayjs'
import { Friend } from './Friend'
export interface Participant {
  score?: number
  isWinner?: boolean
  friend: Friend
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
