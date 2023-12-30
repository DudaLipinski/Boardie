-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleAndSurname" TEXT NOT NULL,
    "age" INTEGER,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unregisteredAt" DATETIME,
    "referredByUserId" INTEGER,
    CONSTRAINT "user_referredByUserId_fkey" FOREIGN KEY ("referredByUserId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_user" ("age", "createdAt", "email", "firstName", "id", "middleAndSurname", "password", "unregisteredAt") SELECT "age", "createdAt", "email", "firstName", "id", "middleAndSurname", "password", "unregisteredAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE INDEX "user_email_idx" ON "user"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
