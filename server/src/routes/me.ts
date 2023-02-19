import { Express } from 'express'
import * as userController from '../controllers/user'
import * as matchesController from '../controllers/matches'
import * as anonFriendsController from '../controllers/anonFriends'

const meEndpoint = '/me'

export function set(app: Express) {
  app.post(meEndpoint, userController.create)
  app.post(`${meEndpoint}/unregister`, userController.unregisterLoggedUser)

  app.post(`${meEndpoint}/matches`, matchesController.createForLoggedUser)
  app.get(`${meEndpoint}/matches`, matchesController.getAllByLoggedUser)

  app.post(
    `${meEndpoint}/anonfriend`,
    anonFriendsController.createForLoggedUser
  )
}
