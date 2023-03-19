import { User } from '../types/User'

const SET_USER = 'SET_USER'

const INITIAL_STATE = null

export const reducer = (
  state = INITIAL_STATE,
  action: { type: any; payload: any }
) => {
  switch (action.type) {
    case SET_USER:
      return action.payload
    default:
      return state
  }
}

export const actions = {
  setUser: (user: User) => ({ type: SET_USER, payload: user }),
}

export const selectors = {
  getUser: (state: { user: User }) => state.user,
  getUserId: (state: { user: { id: string } }) => state.user.id,
  getIsLoggedIn: (state: { user: User }) => !!state.user,
}
