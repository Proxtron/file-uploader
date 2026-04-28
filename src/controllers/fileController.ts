import { Request, Response, NextFunction } from "express"
import { addFile, deleteFile, getFileById } from "../db/file";
import { getPath } from "../utils/fileSystem";
import { deleteFile as deleteFileFromFS } from "../utils/fileSystem";
import supabase from "../config/supabaseConfig";

export const getAddFile = (req: Request<{parentFolderId: string}>, res: Response, next: NextFunction) => {
    const parentFolderId = parseInt(req.params.parentFolderId);
    res.render("add-file", {parentFolderId});
}

export const postAddFile = async (req: Request<{}, {}, {parentFolderId: string}>, res: Response, next: NextFunction) => {
    if(!req.file) {
        throw new Error("No uploaded file found when attemping to add file record to the database");
    }

    const parentFolderId = parseInt(req.body.parentFolderId);
    const {originalname, size, buffer } = req.file;

    const addedFile = await addFile(originalname, originalname, parentFolderId, size);
    const { finalResolvedPath } = await getPath(addedFile.id, req.user!.id);
    await supabase.storage.from("files").upload(finalResolvedPath, buffer);


    res.redirect(`/folder/list/${parentFolderId}`);
}

export const getViewFile = async (req: Request<{fileId: string}>, res: Response, next: NextFunction) => {
    const requestedFileId = parseInt(req.params.fileId);
    const file = await getFileById(requestedFileId);
    if(!file) {
        return res.status(404).send("File not found");
    }
    res.render("file-detail", {file});
}

export const getDownloadFile = async (
    req: Request<{fileId: string, parentFolderId: string}>, 
    res: Response, 
    next: NextFunction
) => {
    const fileId = parseInt(req.params.fileId);
    const {finalResolvedPath, originalFilename} = await getPath(fileId, req.user!.id);
    res.download(finalResolvedPath, originalFilename);
}

export const getDeleteFile = async (
    req: Request<{fileId: string}>, 
    res: Response, 
    next: NextFunction
) => {
    const fileId = parseInt(req.params.fileId);

    await deleteFileFromFS(fileId, req.user!.id);
    const deletedFile = await deleteFile(fileId);

    res.redirect(`/folder/list/${deletedFile.childOfFolderId}`);
}