import { Dayjs } from 'dayjs'
import { GenericUser } from './GenericUser'
export interface Participant {
  id?: number
  score?: number
  isWinner?: boolean
  friend: GenericUser
}
export interface Match {
  id: number
  authorId: string
  boardgameName: string
  startedAt: Dayjs | string
  endedAt: Dayjs | string | null
  notes: string
  participants: Participant[]
}
