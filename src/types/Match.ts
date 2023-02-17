export interface Partipants {
  participants: Array<{
    userId: string
    fullName: string
    score: number
    isWinner: boolean
  }>
}
export interface Match extends Partipants {
  id: string
  authorId: string
  boardgameName: string
  date: string
  duration: number
  notes: string
}
