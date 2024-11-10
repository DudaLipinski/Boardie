import type { Transaction as KyselyTransaction } from 'kysely'
import { Kysely, MysqlDialect } from 'kysely'
import type { DB } from './types'
import { createPool } from 'mysql2'

// const database = new Database('./database.db')
// database.pragma('journal_mode = WAL')
// database.pragma('foreign_keys = ON')

export type Transaction = KyselyTransaction<DB>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TransactionableContext = { transaction?: Transaction } | any

const mysqlPool = createPool({
  host: 'localhost',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_LOCAL_PORT!),
  user: process.env.MYSQL_USER,
})

export default new Kysely<DB>({
  // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
  dialect: new MysqlDialect({
    pool: mysqlPool,
  }),
})
