export const prefixKeysWithDollar = <
  T extends Record<string, string | number | boolean>
>(
  parameters: T
): Record<string, T[keyof T]> =>
  Object.entries(parameters).reduce(
    (result, [key, value]) => ({
      ...result,
      [`$${key}`]: value,
    }),
    {}
  )

export enum FriendType {
  ANON_FRIEND = 'ANON_FRIEND',
  USER = 'USER',
}
