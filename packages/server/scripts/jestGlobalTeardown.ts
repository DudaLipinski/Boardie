import { teardown as teardownDevServer } from 'jest-dev-server'

export default async function globalTeardown() {
  console.log('--- RUNNING TEARDOWN ---')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await teardownDevServer(globalThis.servers)
}
