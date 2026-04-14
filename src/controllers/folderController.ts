import { Request, Response, NextFunction } from "express"
import { getChildrenOfFolder, getRootFolderId, insertFolder, deleteFolder as deleteFolderDB, updateFolder, getChildrenOfFolderWithoutUser } from "../db/folder";

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

export const createFolder = async (req: Request<{}, {}, {
    foldername: string,
    childOfFolderId: string
}>, res: Response, next: NextFunction) => {
    const foldername = req.body.foldername;
    const childOfFolderId = parseInt(req.body.childOfFolderId);
    const postedByUserId = req.user!.id;

    await insertFolder(foldername, childOfFolderId, postedByUserId);
    res.redirect(`/folder/list/${childOfFolderId}`);
}

export const createFolderForm = async (req: Request<{childOfFolderId: string}>, res: Response, next: NextFunction) => {
    const childOfFolderId = parseInt(req.params.childOfFolderId);

    res.render("create-folder", {childOfFolderId});
}

export const deleteFolder = async (req: Request<{folderId: string}>, res: Response, next: NextFunction) => {
    const folderId = parseInt(req.params.folderId);
    const postedByUserId = req.user!.id;

    const deletedFolder = await deleteFolderDB(folderId, postedByUserId)
    res.redirect(`/folder/list/${deletedFolder.childOfFolderId}`);
}

export const postUpdateFolder = async (
    req: Request<{}, {}, {folderId: string, newFolderName: string}>, 
    res: Response, 
    next: NextFunction
) => {
    const folderId = parseInt(req.body.folderId);
    const newFolderName = req.body.newFolderName;
    const userId = req.user!.id;

    const updatedFolder = await updateFolder(newFolderName, folderId, userId);
    res.redirect(`/folder/list/${updatedFolder.childOfFolderId}`);
}

export const getUpdateFolder = async(
    req: Request<{folderId: string}>, 
    res: Response, 
    next: NextFunction
) => {
    const folderId = parseInt(req.params.folderId);
    const userId = req.user!.id;

    const folderDetail = await getChildrenOfFolder(folderId, userId);

    res.render("update-folder", {folderId: folderDetail?.id, foldername: folderDetail?.foldername})
}