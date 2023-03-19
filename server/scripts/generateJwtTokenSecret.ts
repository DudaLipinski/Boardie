import crypto from 'crypto'
import fs from 'fs'
import dotenv from 'dotenv'

import { JWT_TOKEN_SECRET_KEY } from '../src/constants'

const ENV_LOCAL_PATH = '.env.local'

const hasExistentSecret = () => {
  const hasEnvLocal = fs.existsSync(ENV_LOCAL_PATH)
  if (hasEnvLocal) {
    const envLocalRaw = fs.readFileSync(ENV_LOCAL_PATH).toString()

    const envLocal = dotenv.parse(envLocalRaw)
    if (envLocal[JWT_TOKEN_SECRET_KEY]) {
      return true
    }
  }
}

if (!hasExistentSecret()) {
  const token = crypto.randomBytes(64).toString('hex')
  fs.appendFileSync(ENV_LOCAL_PATH, `${JWT_TOKEN_SECRET_KEY}=${token}`)
}
