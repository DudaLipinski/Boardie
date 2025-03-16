/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import path from 'path'
import type { GenericEndpoint } from '@boardie/endpoints'
import controllersMap from '../endpoints'
import metadata from '../openapi.metadata.json' assert { type: 'json' }

const controllers = Object.values(controllersMap)
const endpoints = controllers.flatMap((endpoints) =>
  Object.values(endpoints),
) as GenericEndpoint[]

const paths: Record<string, any> = {}
endpoints.forEach((endpoint) => {
  const path = endpoint.path
  const method = endpoint.method

  if (!paths[path]) {
    paths[path] = {}
  }

  paths[path][method] = endpoint.getOpenApiObject()
})

const result = {
  ...metadata,
  paths,
}

fs.writeFile(
  path.relative(process.cwd(), 'src/openapi.json'),
  JSON.stringify(result, null, 2),
  (err: any) => {
    if (err) {
      console.error(err)
    }
  },
)

export {}
