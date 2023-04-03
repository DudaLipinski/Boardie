/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import path from 'path'
import controllersMap from '../controllers'
import type { Path } from '../utils/endpoint'
import headers from '../openapi.headers.json' assert { type: 'json' }

const controllers = Object.values(controllersMap)
const endpoints = controllers.flatMap((endpoints) =>
  Object.values(endpoints)
) as Path<any, any, any>[]

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
  ...headers,
  paths,
}

fs.writeFile(
  path.relative(process.cwd(), 'src/openapi.json'),
  JSON.stringify(result, null, 2),
  (err) => {
    if (err) {
      console.error(err)
    }
  }
)

export {}
