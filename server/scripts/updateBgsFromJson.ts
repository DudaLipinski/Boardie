import fs from 'fs'
import path from 'path'
import * as url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const boardgamesFilePath = path.join(__dirname, './boardgames.json')
const migrationsFolder = path.join(__dirname, '../prisma/migrations')

type ExtractedBoardgame = {
  imageUrl: string | null
  bggId: string
  title: string
  year: string
}
const boardgamesJson = fs.readFileSync(boardgamesFilePath, 'utf8')
const boardgames: ExtractedBoardgame[] = JSON.parse(boardgamesJson)

function mysql_real_escape_string(str: string) {
  // eslint-disable-next-line no-control-regex, no-useless-escape
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char: string) {
    switch (char) {
      case '\0':
        return '\\0'
      case '\x08':
        return '\\b'
      case '\x09':
        return '\\t'
      case '\x1a':
        return '\\z'
      case '\n':
        return '\\n'
      case '\r':
        return '\\r'
      case '"':
        return '""'
      case "'":
        return "''"
      case '\\':
      case '%':
        return '\\' + char
      default:
        return char
    }
  })
}
const updateOrCreateSql = boardgames
  .map(
    (boardgame) =>
      `INSERT INTO boardgame (title, imageUrl, bggId, year) VALUES ('${mysql_real_escape_string(
        boardgame.title
      )}', ${
        boardgame.imageUrl
          ? `'${mysql_real_escape_string(boardgame.imageUrl)}'`
          : 'NULL'
      }, ${boardgame.bggId}, ${
        boardgame.year
      }) ON CONFLICT (bggId) DO UPDATE SET title = EXCLUDED.title, imageUrl = EXCLUDED.imageUrl, year = EXCLUDED.year;`
  )
  .join('\n')

const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth() + 1
const currentDay = currentDate.getDate()
const currentHour = currentDate.getHours()
const currentMinute = currentDate.getMinutes()
const currentSecond = currentDate.getSeconds()

const migrationFolderName = `${currentYear}${currentMonth}${currentDay}${currentHour}${currentMinute}${currentSecond}___update_bgs`
const migrationFolderPath = path.join(migrationsFolder, migrationFolderName)
fs.mkdirSync(migrationFolderPath)

const migrationFilePath = path.join(migrationFolderPath, 'migration.sql')
fs.writeFileSync(migrationFilePath, updateOrCreateSql)
