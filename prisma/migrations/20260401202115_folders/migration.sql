/*
  Warnings:

  - You are about to drop the column `postedByUserId` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[originalFilename,childOfFolderId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `childOfFolderId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_postedByUserId_fkey";

-- DropIndex
DROP INDEX "File_originalFilename_postedByUserId_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "postedByUserId",
ADD COLUMN     "childOfFolderId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "foldername" TEXT NOT NULL,
    "childOfFolderId" INTEGER,
    "postedByUserId" INTEGER NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Folder_foldername_childOfFolderId_key" ON "Folder"("foldername", "childOfFolderId");

-- CreateIndex
CREATE UNIQUE INDEX "File_originalFilename_childOfFolderId_key" ON "File"("originalFilename", "childOfFolderId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_childOfFolderId_fkey" FOREIGN KEY ("childOfFolderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_childOfFolderId_fkey" FOREIGN KEY ("childOfFolderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_postedByUserId_fkey" FOREIGN KEY ("postedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
