import db from '.'

const currentUserVersion = 1

function getUserVersion() {
  return new Promise<number>((resolve, reject) => {
    db.get(
      `PRAGMA user_version`,
      function (err: any, result: { user_version: number }) {
        if (err) {
          return reject(err)
        }

        resolve(result.user_version)
      }
    )
  })
}

const updateToLatestUserVersion = () =>
  db.asyncRun(`PRAGMA user_version = ${currentUserVersion}`)

const migrations: Record<number, string> = {
  0: `
    ALTER TABLE \`match\` ADD COLUMN \`deletedAt\` TEXT;
  `,
}
const runMigrations = async (currentVersion: number) => {
  for (let i = currentVersion; i < currentUserVersion; i++) {
    if (migrations[i]) {
      await db.asyncRun(migrations[i])
    }
  }
}

export default () =>
  getUserVersion().then(runMigrations).then(updateToLatestUserVersion)
