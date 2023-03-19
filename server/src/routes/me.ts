import type { Express } from 'express'
import * as userController from '../controllers/user'
import * as matchesController from '../controllers/matches'
import * as friendsController from '../controllers/friends'
import * as anonFriendsController from '../controllers/anonFriends'

export function set(app: Express) {
  userController.getLoggedUser.setRouter(app) // GET /me
  userController.create.setRouter(app) // POST /me
  userController.unregisterLoggedUser.setRouter(app) // DELETE /me

  matchesController.createForLoggedUser.setRouter(app) // POST /me/matches
  matchesController.getAllByLoggedUser.setRouter(app) // GET /me/matches

  friendsController.getAllByLoggedUser.setRouter(app) // GET /me/friends

  anonFriendsController.createForLoggedUser.setRouter(app) // POST /me/anon-friends
  anonFriendsController.update.setRouter(app) // PUT /me/anon-friends/:anonFriendId
  anonFriendsController.deleteById.setRouter(app) // DELETE /me/anon-friends/:anonFriendId
}
