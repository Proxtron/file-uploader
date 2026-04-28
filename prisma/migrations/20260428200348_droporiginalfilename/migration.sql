/*
  Warnings:

  - You are about to drop the column `originalFilename` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[filename,childOfFolderId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "File_originalFilename_childOfFolderId_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "originalFilename";

-- CreateIndex
CREATE UNIQUE INDEX "File_filename_childOfFolderId_key" ON "File"("filename", "childOfFolderId");
