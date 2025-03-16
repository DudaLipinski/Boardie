import type { z } from 'zod'
import { type StatusCode, type StatusDescription } from './statusCode'

type MimeTypes =
  | 'application/json'
  | 'text/plain'
  | 'text/html'
  | 'multipart/form-data'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream'

export interface Response<T extends z.ZodType<unknown>> {
  description?: string
  contentType?: MimeTypes
  schema?: T
}

export type Responses = {
  [Key in StatusCode]?: Response<z.ZodType<unknown>>
}
