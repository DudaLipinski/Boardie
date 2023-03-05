import Ajv, { KeywordDefinition } from 'ajv'

const isoUtcDateTimeRegex =
  /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?0Z$/i
const customKeywords: KeywordDefinition[] = [
  {
    keyword: 'isoUtcDateTime',
    type: 'string',
    schemaType: 'boolean',
    compile: () => (dateTimeString) => isoUtcDateTimeRegex.test(dateTimeString),
  },
]

const ajv = new Ajv({ allErrors: true })
for (const keyword of customKeywords) {
  ajv.addKeyword(keyword)
}

export default ajv
