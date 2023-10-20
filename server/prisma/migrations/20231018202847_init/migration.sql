-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleAndSurname" TEXT NOT NULL,
    "age" INTEGER,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unregisteredAt" DATETIME
);

-- CreateTable
CREATE TABLE "anon_friend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "anon_friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "boardgame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bggId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "imageUrl" TEXT
);

-- CreateTable
CREATE TABLE "match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "boardgameId" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME,
    "location" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    "authorId" INTEGER,
    CONSTRAINT "match_boardgameId_fkey" FOREIGN KEY ("boardgameId") REFERENCES "boardgame" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "match_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "player" (
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

-- CreateTable
CREATE TABLE "friendship_request" (
    "requestingUserId" INTEGER NOT NULL,
    "requestedUserId" INTEGER NOT NULL,

    PRIMARY KEY ("requestingUserId", "requestedUserId"),
    CONSTRAINT "friendship_request_requestingUserId_fkey" FOREIGN KEY ("requestingUserId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "friendship_request_requestedUserId_fkey" FOREIGN KEY ("requestedUserId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "friendship" (
    "smallerUserId" INTEGER NOT NULL,
    "biggerUserId" INTEGER NOT NULL,

    PRIMARY KEY ("smallerUserId", "biggerUserId"),
    CONSTRAINT "friendship_smallerUserId_fkey" FOREIGN KEY ("smallerUserId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "friendship_biggerUserId_fkey" FOREIGN KEY ("biggerUserId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "anon_friend_userId_idx" ON "anon_friend"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "boardgame_bggId_key" ON "boardgame"("bggId");

-- CreateIndex
CREATE INDEX "match_authorId_idx" ON "match"("authorId");

-- CreateIndex
CREATE INDEX "player_matchId_idx" ON "player"("matchId");
