import z from 'zod'

const isoUtcDateTimeRegex =
  /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?Z$/i

export const isoDateString = () =>
  z.string().refine((value) => isoUtcDateTimeRegex.test(value), {
    message: 'Must be a valid ISO UTC date-time',
  })

export type DataObject<T> = { data: T }
export const getDataObjectSchema = <T extends z.ZodType>(schema: T) =>
  z.object({ data: schema })
