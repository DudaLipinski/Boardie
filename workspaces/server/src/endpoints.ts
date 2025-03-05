import { endpoints as user } from './modules/users/users.controller'
import { endpoints as auth } from './modules/auth/auth.controller'
import { endpoints as matches } from './modules/matches/matches.controller'
import { endpoints as friends } from './modules/friends/friends.controller'
import { endpoints as anonFriends } from './modules/friends/anonFriends/anonFriends.controllers'
import { endpoints as players } from './modules/matches/players/players.controller'
import { endpoints as boardgames } from './modules/boardgames/boardgames.controller'

export default {
  user,
  auth,
  matches,
  friends,
  anonFriends,
  players,
  boardgames,
}
