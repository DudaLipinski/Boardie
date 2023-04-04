-- CreateTable
CREATE TABLE "friendship" (
    "userAId" INTEGER NOT NULL,
    "userBId" INTEGER NOT NULL,

    PRIMARY KEY ("userAId", "userBId"),
    CONSTRAINT "friendship_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "friendship_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
