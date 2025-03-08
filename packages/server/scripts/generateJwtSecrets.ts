import crypto from 'crypto'
import fs from 'fs'
import dotenv from 'dotenv'

import {
  JWT_AUTH_SECRET_KEY,
  JWT_ANON_FRIEND_INVITE_SECRET_KEY,
} from '../src/constants'

const ENV_LOCAL_PATH = '.env.local'

const hasExistentSecret = (secretKey: string) => {
  const hasEnvLocal = fs.existsSync(ENV_LOCAL_PATH)
  if (hasEnvLocal) {
    const envLocalRaw = fs.readFileSync(ENV_LOCAL_PATH).toString()

    const envLocal = dotenv.parse(envLocalRaw)
    if (envLocal[secretKey]) {
      return true
    }
  }
}

const createIfNotExists = (secretKey: string) => {
  if (hasExistentSecret(secretKey)) {
    return
  }

  const token = crypto.randomBytes(64).toString('hex')
  fs.appendFileSync(ENV_LOCAL_PATH, `\n${secretKey}=${token}`)
}

createIfNotExists(JWT_AUTH_SECRET_KEY)
createIfNotExists(JWT_ANON_FRIEND_INVITE_SECRET_KEY)
