/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import path from 'path'
import controllersMap from '../endpoints'
import type { Path } from '../utils/endpoint.utils'
import metadata from '../openapi.metadata.json' assert { type: 'json' }

const controllers = Object.values(controllersMap)
const endpoints = controllers.flatMap((endpoints) =>
  Object.values(endpoints)
) as Path<any, any, any, any>[]

const paths: Record<string, any> = {}
endpoints.forEach((endpoint) => {
  const path = endpoint.getPath()
  const method = endpoint.getMethod()

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
  }
)

export {}
