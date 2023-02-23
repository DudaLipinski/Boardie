import { Express } from 'express'
import * as userController from '../controllers/user'
import * as matchesController from '../controllers/matches'
import * as friendsController from '../controllers/friends'

const meEndpoint = '/me'

export function set(app: Express) {
  app.get(meEndpoint, userController.getLoggedUser)
  app.post(meEndpoint, userController.create)
  app.post(`${meEndpoint}/unregister`, userController.unregisterLoggedUser)

  app.post(`${meEndpoint}/matches`, matchesController.createForLoggedUser)
  app.get(`${meEndpoint}/matches`, matchesController.getAllByLoggedUser)

  app.get(`${meEndpoint}/friends`, friendsController.getAllByLoggedUser)
  app.post(
    `${meEndpoint}/anonfriends`,
    friendsController.createAnonymousForLoggedUser
  )
}
