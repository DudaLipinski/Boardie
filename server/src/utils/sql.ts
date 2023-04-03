import { sql } from 'kysely'

export const CURRENT_DATETIME = "strftime('%Y-%m-%d %H:%M:%S', datetime('now'))"

export const CURRENT_DATETIME_QUERY = sql<string>`strftime('%Y-%m-%d %H:%M:%S', datetime('now'))`
