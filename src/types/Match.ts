export interface Match {
  id: string
  boardgameName: string
  date: string
  duration: number
  notes: string
  participants: Array<{
    fullName: string
    score: number
    isWinner: boolean
  }>
}
