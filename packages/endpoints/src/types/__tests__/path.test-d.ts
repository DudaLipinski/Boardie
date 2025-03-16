import { expectTypeOf } from 'vitest'
import type { PathParametersFromUrl, PathParamsFromUrl } from '../path'

test('PathParamsFromUrl', () => {
  expectTypeOf(
    '' as PathParamsFromUrl<'/users/:userId/posts/:postId'>,
  ).toEqualTypeOf<'userId' | 'postId'>()

  expectTypeOf('' as PathParamsFromUrl<'/users/:userId/:postId'>).toEqualTypeOf<
    'userId' | 'postId'
  >()

  expectTypeOf(
    '' as PathParamsFromUrl<'/users/:userId'>,
  ).toEqualTypeOf<'userId'>()

  expectTypeOf({} as PathParamsFromUrl<'/:userId'>).toEqualTypeOf<'userId'>()

  expectTypeOf({} as PathParamsFromUrl<'/user'>).toEqualTypeOf<never>()
})

test('PathParametersFromUrl', () => {
  expectTypeOf(
    {} as PathParametersFromUrl<'/users/:userId/posts/:postId'>,
  ).toMatchObjectType<{
    userId: {
      description: string
    }
    postId: {
      description: string
    }
  }>()

  expectTypeOf(
    {} as PathParametersFromUrl<'/users/:userId/:postId'>,
  ).toMatchObjectType<{
    userId: {
      description: string
    }
    postId: {
      description: string
    }
  }>()

  expectTypeOf(
    {} as PathParametersFromUrl<'/users/:userId'>,
  ).toMatchObjectType<{
    userId: {
      description: string
    }
  }>()

  expectTypeOf({} as PathParametersFromUrl<'/:userId'>).toMatchObjectType<{
    userId: {
      description: string
    }
  }>()

  expectTypeOf({} as PathParametersFromUrl<'/user'>).toMatchObjectType<{}>()
})
