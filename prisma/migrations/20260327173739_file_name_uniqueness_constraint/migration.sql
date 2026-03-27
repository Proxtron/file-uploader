/*
  Warnings:

  - A unique constraint covering the columns `[originalFilename,postedByUserId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `originalFilename` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File_filename_key";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "originalFilename" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_originalFilename_postedByUserId_key" ON "File"("originalFilename", "postedByUserId");
