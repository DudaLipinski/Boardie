import fs from 'fs'
import path from 'path'
import * as url from 'url'

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
const allBoardgames: ExtractedBoardgame[] = JSON.parse(boardgamesJson)

const generateMigration = (
  boardgames: ExtractedBoardgame[],
  bgsOffset: number
) => {
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
          boardgame.year || 'NULL'
        }) ON CONFLICT (bggId) DO UPDATE SET title = EXCLUDED.title, imageUrl = EXCLUDED.imageUrl, year = EXCLUDED.year;`
    )
    .join('\n')

  const currentDate = new Date()
  const currentYear = currentDate.getUTCFullYear()
  const currentMonth = currentDate.getUTCMonth() + 1
  const currentDay = currentDate.getUTCMonth()
  const currentHour = currentDate.getUTCHours()
  const currentMinute = currentDate.getUTCMinutes()
  const currentSecond = currentDate.getUTCSeconds()

  const migrationFolderName = `${currentYear}${currentMonth}${currentDay}${currentHour}${currentMinute}${currentSecond}__update-bgs_${bgsOffset}-${
    bgsOffset + boardgames.length
  }`
  const migrationFolderPath = path.join(migrationsFolder, migrationFolderName)
  fs.mkdirSync(migrationFolderPath)

  const migrationFilePath = path.join(migrationFolderPath, 'migration.sql')
  fs.writeFileSync(migrationFilePath, updateOrCreateSql)
}

const OFFSET_STEP = 1000
let offset = 0
while (offset < allBoardgames.length) {
  const boardgames = allBoardgames.slice(offset, offset + OFFSET_STEP)
  generateMigration(boardgames, offset)
  offset += OFFSET_STEP
}
