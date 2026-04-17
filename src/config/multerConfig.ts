import multer from "multer";
import path from "path";
import fs from "fs";
import type { Request } from "express";
import { getChildrenOfFolderWithoutUser } from "../db/folder";

const storage = multer.diskStorage({
    destination: async (req: Request<{}, {}, {parentFolderId: string}>, file, cb) => {
        const basePath = path.join(import.meta.dirname, "../public/uploads/");
        if(!req.user) return cb(new Error("User not found to associate folder with"), basePath);
        const userId = req.user.id;
        const userPath = `${basePath}/${userId}/`

        const parentFolderId = parseInt(req.body.parentFolderId);
    
        //The path of the folder belonging to "parentFolderId" in the filesystem
        let folderPath = "";
        let currentFolderId: number | null = parentFolderId;
    
        while(currentFolderId !== null) {
            let folderDetail = await getChildrenOfFolderWithoutUser(currentFolderId);
            if(!folderDetail) {
                return cb(new Error(`Folder could not be found for folderId: ${currentFolderId}`), userPath);
            }
    
            if(folderDetail.childOfFolderId != null) {
                //Next highest folder level
                folderPath = `${folderDetail.foldername}/${folderPath}`
            } 
    
            currentFolderId = folderDetail.childOfFolderId
        }

        const finalResolvedPath = `${basePath}/${userId}/${folderPath}`;

        fs.mkdirSync(finalResolvedPath);
        return cb(null, finalResolvedPath);
    }
});

export const upload = multer({storage});

