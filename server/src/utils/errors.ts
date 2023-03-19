export const INTERNAL_ERROR_SCHEMA = {
  description: 'Unexpected internal error',
  schema: {
    title: 'Internal error',
    description: 'An unexpected internal error',
    type: 'object',
    properties: {
      message: { type: 'string' },
    },
    required: ['message'],
    additionalProperties: false,
  },
} as const

export const INVALID_REQUEST_BODY_SCHEMA = {
  description: 'Invalid request body',
  schema: {
    title: 'Invalid request body',
    description: 'The request body is invalid',
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description:
          'An informative error message informing the issue with the request body',
      },
    },
    required: ['message'],
    additionalProperties: false,
  },
} as const
