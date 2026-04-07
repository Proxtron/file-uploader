import { Request, Response, NextFunction } from "express"
import { getChildrenOfFolder, getRootFolderId } from "../db/folder";

export const getRootFolderChildren = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const rootFolder = await getRootFolderId(userId);
    if(!rootFolder) throw new Error("This user does not have a root folder");
    const rootFolderId = rootFolder.id;

    const folderDetail = await getChildrenOfFolder(rootFolderId, userId);

    if(!folderDetail) {
        throw new Error("Can't find children of this folder");
    }

    res.render("folder-detail", {folderDetail});
}

export const getFolderChildren = async (req: Request<{folderId: string}>, res: Response, next: NextFunction) => {
    const folderId = parseInt(req.params.folderId);
    const userId = req.user!.id;

    const folderDetail = await getChildrenOfFolder(folderId, userId);

    if(!folderDetail) {
        throw new Error("Can't find children of this folder");
    }

    res.render("folder-detail", {folderDetail});
}