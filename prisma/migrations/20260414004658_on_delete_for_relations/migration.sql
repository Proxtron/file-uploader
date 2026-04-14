-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_childOfFolderId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_childOfFolderId_fkey";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_childOfFolderId_fkey" FOREIGN KEY ("childOfFolderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_childOfFolderId_fkey" FOREIGN KEY ("childOfFolderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
