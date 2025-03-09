import Database from 'better-sqlite3'
import type { Transaction as KyselyTransaction } from 'kysely'
import { Kysely, SqliteDialect } from 'kysely'
import type { DB } from './types'

const database = new Database('./database.db')
database.pragma('journal_mode = WAL')
database.pragma('foreign_keys = ON')

export type Transaction = KyselyTransaction<DB>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransactionableContext = { transaction?: Transaction } | any

export default new Kysely<DB>({
  // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
  dialect: new SqliteDialect({
    database,
  }),
})
