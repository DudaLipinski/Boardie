import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })

const isoUtcDateTimeRegex =
  /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?0Z$/i
ajv.addKeyword({
  keyword: 'isoUtcDateTime',
  type: 'string',
  schemaType: 'boolean',
  compile: () => (dateTimeString) => isoUtcDateTimeRegex.test(dateTimeString),
})

export default ajv
