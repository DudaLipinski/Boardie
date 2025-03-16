import { expect, test } from 'vitest'
import {
  checkPathTemplatingMatching,
  getPathPartsMap,
  urlHasUnescapedCharacters,
} from '../path.utils'

test('urlHasUnescapedCharacters', () => {
  expect(urlHasUnescapedCharacters('/users/:userId/posts/:postId')).toBe(false)

  expect(urlHasUnescapedCharacters('/users/:userId/:postId')).toBe(false)

  expect(urlHasUnescapedCharacters('/users/:userId')).toBe(false)

  expect(urlHasUnescapedCharacters('/:userId')).toBe(false)

  expect(urlHasUnescapedCharacters('/users/:userId/posts/:post#id')).toBe(true)

  expect(urlHasUnescapedCharacters('/users/:userId/:post?id')).toBe(true)

  expect(urlHasUnescapedCharacters('/users/#a')).toBe(true)

  expect(urlHasUnescapedCharacters('/users/?a')).toBe(true)
})

test('getPathPartsMap', () => {
  const pathPartsMap = getPathPartsMap([
    '/:userId',
    '/users',
    '/pets',
    '/pets/mine',
    '/pets/:petId',
    '/users/:userId',
    '/pets/:name/mine',
    '/users/match/:postId',
    '/users/:userId/posts/:postId',
  ])

  expect(pathPartsMap).toMatchObject({
    1: [
      {
        path: '/:userId',
        variables: [
          {
            index: 0,
            name: 'userId',
          },
        ],
      },
      {
        path: '/users',
        variables: [],
      },
      {
        path: '/pets',
        variables: [],
      },
    ],
    2: [
      {
        path: '/pets/mine',
        variables: [],
      },
      {
        path: '/pets/:petId',
        variables: [
          {
            index: 1,
            name: 'petId',
          },
        ],
      },
      {
        path: '/users/:userId',
        variables: [
          {
            index: 1,
            name: 'userId',
          },
        ],
      },
    ],
    3: [
      {
        path: '/pets/:name/mine',
        variables: [
          {
            index: 1,
            name: 'name',
          },
        ],
      },
      {
        path: '/users/match/:postId',
        variables: [
          {
            index: 2,
            name: 'postId',
          },
        ],
      },
    ],
    4: [
      {
        path: '/users/:userId/posts/:postId',
        variables: [
          {
            index: 1,
            name: 'userId',
          },
          {
            index: 3,
            name: 'postId',
          },
        ],
      },
    ],
  })
})

/**
 * This set of examples was taken from the OpenApi spec
 * @see https://spec.openapis.org/oas/v3.1.1.html#path-templating-matching
 * But they don't cover cases where all paths with the same prefix
 * must have the same following parts, especially path variables.
 *
 * Example:
 *
 * /:entity/me
 * /books/:id
 * /:entity/me/other
 * /:entity/:id/other
 */
test('checkPathTemplatingMatching', () => {
  expect(() =>
    checkPathTemplatingMatching(['/pets/:petId', '/pets/mine']),
  ).toThrow(
    'The paths "/pets/:petId" and "/pets/mine" might lead to unintended matching if "/pets/:petId" has a path variable that resolves to the same URL as "/pets/mine".',
  )

  expect(() =>
    checkPathTemplatingMatching(['/pets/:petId', '/pets/:name']),
  ).toThrowError(
    'The following paths are considered identical and invalid: "/pets/:petId" and "/pets/:name"',
  )

  expect(() =>
    checkPathTemplatingMatching(['/:entity/me', '/books/:id']),
  ).toThrowError(
    'The following paths may lead to ambiguous resolution: "/:entity/me" and "/books/:id"',
  )
})
