import type { Boardgame } from './Boardgame'
import { GenericUser } from './GenericUser'

export type WinnersSummary = {
  boardgame: Boardgame
  players: (Omit<GenericUser, 'fullName'> & {
    wins: number
  })[]
}
