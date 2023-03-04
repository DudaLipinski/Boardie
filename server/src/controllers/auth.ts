import { RequestHandler } from 'express'
import { validateAuthSchema } from '../schemas/auth'

import * as userModel from '../models/user'
import { generateAccessToken } from '../auth'
import { getErrorMessage } from '../schemas/utils'
import { logInternalError } from '../utils/log'

export const auth: RequestHandler = async (req, res) => {
  const auth = req.body
  if (!auth) {
    return res.status(400).send('You must provide an email and password')
  }

  const validAuth = validateAuthSchema(auth)
  if (!validAuth) {
    const errorMessage = getErrorMessage(validateAuthSchema)
    res.status(400).send(errorMessage)
    return
  }

  try {
    const loggedUser = await userModel.auth(auth)
    if (!loggedUser) {
      return res.sendStatus(401)
    }

    const token = generateAccessToken(loggedUser.id)

    res.status(200).send({
      user: loggedUser,
      token,
    })
  } catch (e) {
    logInternalError(e)
    res.sendStatus(500)
  }
}
