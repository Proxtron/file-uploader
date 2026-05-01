import { Request, Response, NextFunction } from "express"
import { addFile, deleteFile, getFileById } from "../db/file";
import { getPath } from "../utils/fileSystem";
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

    //Insert operation(DB)
    const addedFile = await addFile(originalname, parentFolderId, size);

    //Get the path of the file added to the db
    const { finalResolvedPath } = await getPath(addedFile.id, req.user!.id);

    //Upload file to supabase storage
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
    const {finalResolvedPath, filename} = await getPath(fileId, req.user!.id);

    const {data, error} = await supabase.storage.from("files").download(finalResolvedPath);
    if(error || !data) throw error ?? new Error("File not found in storage");

    const buffer = Buffer.from(await data.arrayBuffer());
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", data.type);
    res.send(buffer);
}

export const getDeleteFile = async (
    req: Request<{fileId: string}>, 
    res: Response, 
    next: NextFunction
) => {
    const fileId = parseInt(req.params.fileId);
    const { finalResolvedPath } = await getPath(fileId, req.user!.id)

    //Delete operation (DB)
    const deletedFile = await deleteFile(fileId);

    //Delete operation (Supabase storage)
    const {data, error} = await supabase.storage.from("files").remove([finalResolvedPath]);
    if(error) throw error;

    res.redirect(`/folder/list/${deletedFile.childOfFolderId}`);
}