import db from '.'
import runMigrations from './migrations'
// import fs from 'fs'
// import path from 'path'

// const initSql = fs.readFileSync(path.resolve('./src/database/init.sql')).toString() // TODO: fix this path
// db.run(initSql)

function handleDatabaseError(error: any) {
  console.error(
    'An error occurred while trying to initialize the database',
    error
  )
  process.exit()
}

async function getSchemaVersion() {
  const response = await db.asyncGet<{ schema_version: number }>(
    'PRAGMA schema_version'
  )
  return response.schema_version
}

async function initDb() {
  const wasDatabaseJustCreated = (await getSchemaVersion()) === 0

  await db.asyncRun(`
    CREATE TABLE IF NOT EXISTS \`user\` (
      \`email\` TEXT NOT NULL,
      \`firstName\` TEXT NOT NULL,
      \`middleAndSurname\` TEXT NOT NULL,
      \`age\` INTEGER NOT NULL,
      \`password\` TEXT NOT NULL,
      \`addressId\` INTEGER,
      \`unregisteredAt\` TEXT
    );
    CREATE TABLE IF NOT EXISTS \`anonFriend\` (
      \`userId\` INTEGER NOT NULL,
      \`fullName\` TEXT
    );
    CREATE TABLE IF NOT EXISTS \`match\` (
      \`authorId\` INTEGER NOT NULL,
      \`boardgameName\` TEXT NOT NULL,
      \`startedAt\` STRING,
      \`endedAt\` STRING,
      \`notes\` TEXT
      \`deletedAt\` TEXT
    );
    CREATE TABLE IF NOT EXISTS \`matchParticipant\` (
      \`matchId\` INTEGER NOT NULL,
      \`userId\` INTEGER,
      \`anonFriendId\` INTEGER,
      \`location\` STRING,
      \`score\` INTEGER,
      \`isWinner\` BOOLEAN DEFAULT FALSE,
      PRIMARY KEY (\`matchId\`, \`userId\`, \`anonFriendId\`)
    );
  `)

  return wasDatabaseJustCreated
}

initDb().then(runMigrations).catch(handleDatabaseError)
