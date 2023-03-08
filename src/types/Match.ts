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
  date: string
  duration: number
  notes: string
  participants: Participant[]
}
