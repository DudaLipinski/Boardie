import { GenericUser } from '../types/GenericUser'
import { Participant } from '../types/Match'
import { User } from '../types/User'

export const userToGeneric = (user: User): GenericUser => {
  return {
    id: +user.id,
    fullName: `${user.firstName} ${user.middleAndSurname}`,
    type: 'USER' as const,
  }
}

export const userToParticipant = (user: User): Participant => {
  return {
    score: 0,
    isWinner: false,
    friend: userToGeneric(user),
  }
}
