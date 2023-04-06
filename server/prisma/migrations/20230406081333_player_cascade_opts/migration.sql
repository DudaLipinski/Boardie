-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "score" INTEGER,
    "isWinner" BOOLEAN,
    "matchId" INTEGER NOT NULL,
    "userId" INTEGER,
    "anonFriendId" INTEGER,
    CONSTRAINT "player_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "match" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "player_anonFriendId_fkey" FOREIGN KEY ("anonFriendId") REFERENCES "anon_friend" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_player" ("anonFriendId", "id", "isWinner", "matchId", "score", "userId") SELECT "anonFriendId", "id", "isWinner", "matchId", "score", "userId" FROM "player";
DROP TABLE "player";
ALTER TABLE "new_player" RENAME TO "player";
CREATE INDEX "player_matchId_idx" ON "player"("matchId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
