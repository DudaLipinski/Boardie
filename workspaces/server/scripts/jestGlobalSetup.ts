import { setup as setupDevServer } from 'jest-dev-server'
import dotenv from 'dotenv'

export default async function globalSetup() {
  console.log('--- RUNNING SETUP ---')
  dotenv.config({ path: '.env.local' })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.servers = await setupDevServer({
    command: `yarn start`,
    launchTimeout: 50000,
    port: 3007,
  })
}
