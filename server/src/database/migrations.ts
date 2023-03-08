import db from '.'

/**
 * I'm not proud of this solution, but it's a fast way that I came up with to
 * avoid the need of writing a disclaimer for the API consumers each time
 * some breaking changes are introduced.
 *
 * This is mainly for development purposes during the stage where the API
 * still uses SQLite as a database, and will be removed once we migrate to
 * a more robust database.
 */

async function getUserVersion() {
  const { user_version } = await db.asyncGet<{ user_version: number }>(
    'PRAGMA user_version'
  )
  return user_version
}

const VERSION = 4
export const migrations: Record<number, string> = {
  0: `
    ALTER TABLE \`match\` ADD COLUMN \`deletedAt\` TEXT;
  `,
  1: `
    ALTER TABLE \`matchParticipant\` DROP COLUMN \`fullName\`;
    ALTER TABLE \`matchParticipant\` ADD COLUMN \`userId\` INTEGER;
    ALTER TABLE \`matchParticipant\` ADD COLUMN \`anonFriendId\` INTEGER;
    DELETE FROM \`matchParticipant\`;
    DELETE FROM \`match\`;
  `,
  2: `
    ALTER TABLE \`match\` ADD COLUMN \`startedAt\` STRING;
    UPDATE \`match\` SET \`startedAt\` = \`date\`;
    ALTER TABLE \`match\` DROP COLUMN \`date\`;
    ALTER TABLE \`match\` ADD COLUMN \`endedAt\` STRING;
  `,
  3: `
    ALTER TABLE \`matchParticipant\` ADD COLUMN \`isWinner\` BOOLEAN DEFAULT FALSE;
    ALTER TABLE \`match\` ADD COLUMN \`location\` STRING;
  `,
}

const updateToLatestUserVersion = () =>
  db.asyncRun(`PRAGMA user_version = ${VERSION}`)
const runMigrations = async (currentVersion: number) => {
  for (let i = currentVersion; i < VERSION; i++) {
    if (migrations[i]) {
      await db.asyncExec(migrations[i])
    }
  }
}

export default (wasDatabaseJustCreated: boolean) =>
  wasDatabaseJustCreated
    ? updateToLatestUserVersion()
    : getUserVersion().then(runMigrations).then(updateToLatestUserVersion)
