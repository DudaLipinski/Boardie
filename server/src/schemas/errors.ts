import { z } from 'zod'

export const INTERNAL_ERROR_SCHEMA = z
  .object({
    message: z.string(),
  })
  .describe('An unexpected internal error')
  .optional()

export const INVALID_REQUEST_BODY_SCHEMA = z
  .object({
    message: z
      .string()
      .describe(
        'An informative error message informing the issue with the request body'
      ),
  })
  .describe('The request body is invalid')
  .optional()
