import { getFileById } from "../db/file";
import { getChildrenOfFolderWithoutUser } from "../db/folder";
import fs from "fs";

export const getPath = async (fileId: number, userId: number) => {
    const file = await getFileById(fileId);
    if(!file) {
        throw new Error("No file found");
    }

    //The path of the folder belonging to "folderId" in the filesystem
    let folderPath = "";
    let currentFolderId: number | null = file.childOfFolderId;

    while(currentFolderId !== null) {
        let folderDetail = await getChildrenOfFolderWithoutUser(currentFolderId);
        if(!folderDetail) {
            throw new Error("No folder found");
        }

        if(folderDetail.childOfFolderId != null) {
            //Next highest folder level
            folderPath = `${folderDetail.foldername}/${folderPath}`
        } 

        currentFolderId = folderDetail.childOfFolderId
    }

    const filename = file.filename

    let finalResolvedPath;
    if(folderPath) {
        finalResolvedPath = `${userId}/${folderPath}/${filename}`;
    } else {
        finalResolvedPath = `${userId}/${filename}`
    }

    return {finalResolvedPath, filename};
}