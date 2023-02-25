import { RequestHandler } from 'express'
import omit from 'lodash.omit'

import validateUser from '../schemas/user'
import validateAuth from '../schemas/auth'
import * as userModel from '../models/user'
import { getErrorMessage } from '../schemas/utils'
import { logInternalError } from '../utils/log'

export const create: RequestHandler = async (req, res) => {
  const user = req.body
  if (!user) {
    return res.status(400).send('bla')
  }

  const validUser = validateUser(user)
  if (!validUser) {
    const errorMessage = getErrorMessage(validateUser)

    res.status(400).send({ message: errorMessage })
    return
  }

  try {
    const userWithSameEmail = await userModel.getByEmail(user.email)
    if (userWithSameEmail) {
      return res
        .status(409)
        .send("There's already a user registered with this email")
    }

    const id = await userModel.create(user)
    res.status(200).send({
      id,
      ...omit(user, 'password'),
    })
  } catch (e) {
    logInternalError(e)
    res.status(500).send('Internal error')
  }
}

export const getLoggedUser: RequestHandler = async (req, res) => {
  try {
    const user = await userModel.getById(req.userId)
    if (!user) {
      return res.sendStatus(404)
    }

    res.status(200).send(user)
  } catch (e) {
    logInternalError(e)
    res.status(500).send('Internal error')
  }
}

/**
 * The ideal solution here would be to send an "unregistering confirmal" email
 * to the user and then complete the operation after that.
 *
 * To do so, we would have to generate a token containing the needed information
 * to identify the user that is trying to be unregistered, and, inside the email,
 * provide a link with the token for the user to confirm the unregistering
 *
 * The front-end will then have to have a specific route to handle that, that
 * will basically call a "confirm unregistering" endpoint passing the token
 */
export const unregisterLoggedUser: RequestHandler = async (req, res) => {
  const auth = req.body
  if (!auth) {
    return res
      .status(400)
      .send({ message: "You should provide user's email and password" })
  }

  const validAuth = validateAuth(auth)
  if (!validAuth) {
    const errorMessage = getErrorMessage(validateAuth)

    res.status(400).send({ message: errorMessage })
    return
  }

  try {
    const unregistered = await userModel.unregister(req.userId, auth)
    if (!unregistered) {
      return res.sendStatus(401)
    }

    res.sendStatus(200)
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}
