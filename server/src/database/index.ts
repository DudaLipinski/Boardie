import sqlite3 from 'sqlite3'

const sqlite3Cli = sqlite3.verbose()

const dbCli = new sqlite3Cli.Database('./database.db', (error) => {
  if (error) {
    console.error(error)
  }

  console.log('Connected to database')
})

/**
 * Those dorky addons are meant to go away once we migrate to MySQL.
 */
function asyncGet<ResponseT>(statement: string) {
  return new Promise<ResponseT>((resolve, reject) => {
    dbCli.get(statement, function (err, result) {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}
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
function asyncExec(statement: string) {
  return new Promise<boolean>((resolve, reject) => {
    dbCli.exec(statement, function (err) {
      if (err) {
        return reject(err)
      }
      resolve(true)
    })
  })
}
interface Addons {
  asyncGet: typeof asyncGet
  asyncRun: typeof asyncRun
  asyncExec: typeof asyncExec
}
const modifiedDbCli: typeof dbCli & Partial<Addons> = dbCli
modifiedDbCli.asyncGet = asyncGet
modifiedDbCli.asyncRun = asyncRun
modifiedDbCli.asyncExec = asyncExec

export default modifiedDbCli as typeof dbCli & Addons
