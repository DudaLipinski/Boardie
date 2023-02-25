import sqlite3 from 'sqlite3'

const sqlite3Cli = sqlite3.verbose()

const dbCli = new sqlite3Cli.Database('./database.db', (error) => {
  if (error) {
    console.error(error)
  }

  console.log('Connected to database')
})

function asyncRun(statement: string) {
  return new Promise<boolean>((resolve, reject) => {
    dbCli.run(statement, function (err) {
      if (err) {
        return reject(err)
      }
      resolve(true)
    })
  })
}

const modifiedDbCli: typeof dbCli & { asyncRun?: typeof asyncRun } = dbCli
modifiedDbCli.asyncRun = asyncRun

export default modifiedDbCli as typeof dbCli & { asyncRun: typeof asyncRun }
