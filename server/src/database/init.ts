import db from '.'
// import fs from 'fs'
// import path from 'path'

// const initSql = fs.readFileSync(path.resolve('./src/database/init.sql')).toString() // TODO: fix this path
// db.run(initSql)

db.run(`
  CREATE TABLE IF NOT EXISTS \`user\` (
    \`email\` TEXT NOT NULL,
    \`firstName\` TEXT NOT NULL,
    \`middleAndSurname\` TEXT NOT NULL,
    \`age\` INTEGER NOT NULL,
    \`password\` TEXT NOT NULL,
    \`addressId\` INTEGER,
    \`unregisteredAt\` TEXT
  );
`)

db.run(`
  CREATE TABLE IF NOT EXISTS \`anonFriend\` (
    \`userId\` INTEGER NOT NULL,
    \`fullName\` TEXT
  );
`)

db.run(`
  CREATE TABLE IF NOT EXISTS \`match\` (
    \`authorId\` INTEGER NOT NULL,
    \`boardgameName\` TEXT NOT NULL,
    \`date\` STRING,
    \`duration\` INTEGER,
    \`notes\` TEXT
  );
`)

db.run(`
  CREATE TABLE IF NOT EXISTS \`matchParticipant\` (
    \`matchId\` INTEGER NOT NULL,
    \`fullName\` TEXT NOT NULL,
    \`score\` INTEGER
  );
`)
