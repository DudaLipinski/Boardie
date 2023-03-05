export const prefixKeysWithDollar = <
  T extends Record<string, string | number | boolean | null>
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

export const generateUpdate = (
  values: Record<string, string | number | boolean | null>
) => {
  const valuesEntries = Object.entries(values)
  const fieldAssignments = valuesEntries
    .map(([key]) => `${key} = $${key}`)
    .join(',\n')

  const params = prefixKeysWithDollar(values)

  return {
    fieldAssignments,
    params,
  }
}
