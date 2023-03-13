import { Participant } from './../types/Match'
import { User } from '../types/User'

export const userToGenericFriend = (user: User): Participant => {
  return {
    score: 0,
    isWinner: false,
    friend: {
      id: +user.id,
      fullName: `${user.firstName} ${user.middleAndSurname}`,
      type: 'USER' as const,
    },
  }
}
