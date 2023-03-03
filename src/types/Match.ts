export interface Participant {
  userId?: string
  fullName: string
  score: number
  isWinner: boolean
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
