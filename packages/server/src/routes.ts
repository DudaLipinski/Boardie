import type { Express } from 'express'

import controllers from './endpoints'

export const setRoutes = (app: Express) => {
  Object.values(controllers).forEach((controller) => {
    Object.values(controller).forEach((route) => {
      route.setRouter(app)
    })
  })
}
