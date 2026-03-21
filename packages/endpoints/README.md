# @boardie/endpoints

A lightweight, typed abstraction over Express endpoints. Define your route once — get a typed handler, Zod body validation, query param checking, and OpenAPI spec generation from the same definition.

This is an experimental personal project, not a maintained library.

## Why

Express gives you no guardrails. You can send a status code you didn't intend, forget to validate the body, or have your OpenAPI docs drift from reality. Most solutions to this (tsoa, NestJS) pull in an entire framework.

This package takes a minimal approach: one declarative definition per endpoint that drives both runtime behavior and documentation.

## Usage

```ts
import { endpoint } from '@boardie/endpoints'
import { z } from 'zod'

const getById = endpoint.get(
  '/matches/:matchId',
  async (req, res) => {
    // req.params.matchId is typed as string
    // req.body, req.query are typed from the definition
    const match = await findMatch(req.params.matchId)
    res.status(200).send(match)
  },
  {
    summary: 'Gets a match by id',
    tags: ['matches'],
    pathParams: {
      matchId: { type: 'string', description: 'The match id' },
    },
    responses: {
      200: {
        description: 'The match',
        schema: matchSchema,
      },
      404: { description: 'Not found' },
    },
  },
)

// Register on an Express app
getById.setRouter(app)

// Generate OpenAPI operation object
getById.getOpenApiObject()
```

## What it does

- **Path param inference**: `endpoint.get('/users/:userId', ...)` forces the definition to include a `userId` path param — enforced at the type level via template literal types
- **Body validation**: if `body` is a Zod schema, the request body is validated before reaching your handler. Invalid requests get a 400 with structured errors
- **Query param checking**: required query params are checked before the handler runs
- **Error boundary**: unhandled errors in the handler return a 500 instead of crashing
- **OpenAPI generation**: `getOpenApiObject()` returns a spec-compliant `OperationObject` derived from the same definition, using `zod-to-json-schema`

## What it doesn't do

- No routing layer — it registers directly on an Express app
- No response validation — it trusts your handler to match the declared schema
- No path param coercion — params arrive as strings (a known TODO)
- No middleware composition — auth/etc. are handled outside this abstraction
