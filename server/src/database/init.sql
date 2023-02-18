PRAGMA journal_mode = MEMORY;
PRAGMA synchronous = OFF;
PRAGMA foreign_keys = OFF;
PRAGMA ignore_check_constraints = OFF;
PRAGMA auto_vacuum = NONE;
PRAGMA secure_delete = OFF;
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS `user` (
  `email` TEXT NOT NULL,
  `firstName` TEXT NOT NULL,
  `middleAndSurname` TEXT NOT NULL,
  `age` INTEGER NOT NULL,
  `password` TEXT NOT NULL,
  `addressId` INTEGER,
  `unregisteredAt` TEXT
);

CREATE TABLE `friendship` (
  `userAId` INTEGER,
  `userBId` INTEGER,
  PRIMARY KEY (`userAId`, `userBId`)
);

CREATE TABLE `friendshipRequest` (
  `requestingUserId` INTEGER,
  `requestedUserId` INTEGER,
  PRIMARY KEY (`requestingUserId`, `requestedUserId`)
);

CREATE TABLE IF NOT EXISTS `match` (
  `authorId` INTEGER NOT NULL,
  `boardgameName` TEXT NOT NULL,
  `date` STRING,
  `duration` INTEGER,
  `notes` TEXT
);

CREATE TABLE IF NOT EXISTS `matchParticipant` (
  `matchId` INTEGER NOT NULL,
  `fullName` TEXT NOT NULL,
  `score` INTEGER
);

ALTER TABLE `friendship` ADD FOREIGN KEY (`userAId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `friendship` ADD FOREIGN KEY (`userBId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `friendshipRequest` ADD FOREIGN KEY (`requestingUserId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `friendshipRequest` ADD FOREIGN KEY (`requestedUserId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

CREATE INDEX IF NOT EXISTS `match_index_0` ON `match` (`authorId`);

CREATE INDEX IF NOT EXISTS `matchParticipant_index_1` ON `matchParticipant` (`matchId`);

ALTER TABLE `match` ADD FOREIGN KEY IF NOT EXISTS (`authorId`) REFERENCES `user` (`id`);

ALTER TABLE `matchParticipant` ADD FOREIGN KEY (`matchId`) REFERENCES `match` (`id`);

COMMIT;
PRAGMA ignore_check_constraints = ON;
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
