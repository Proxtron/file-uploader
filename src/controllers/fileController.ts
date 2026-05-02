import { Request, Response, NextFunction } from "express"
import { addFile, deleteFile, getFileById } from "../db/file";
import supabase from "../config/supabaseConfig";
import { randomUUID } from "crypto";
import { AppError } from "../error/error";

const MAX_FILE_SIZE = 10 * 1000 * 1000; // 10MB

export const getAddFile = (req: Request<{parentFolderId: string}>, res: Response, next: NextFunction) => {
    const parentFolderId = parseInt(req.params.parentFolderId);
    res.render("add-file", {parentFolderId});
}

export const postAddFile = async (req: Request<{}, {}, {parentFolderId: string}>, res: Response, next: NextFunction) => {
    if(!req.file) {
        throw new AppError("No uploaded file found when attemping to add file record to the database");
    }

    const parentFolderId = parseInt(req.body.parentFolderId);
    const {originalname, size, buffer } = req.file;

    if(size > MAX_FILE_SIZE) {
        throw new AppError("File must be under 10MB");
    }

    //Upload file to supabase storage
    const ext = originalname.split(".").pop();
    const uniquePath = `${randomUUID()}.${ext}`;

    const { data, error } = await supabase.storage.from("files").upload(uniquePath, buffer);
    if(error) throw error;
    
    //Insert operation(DB)
    await addFile(originalname, parentFolderId, size, data.path);
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
    const file = await getFileById(fileId);

    if(!file) throw new AppError("File not found");

    const {data, error} = await supabase.storage.from("files").download(file.supabasePath);
    if(error || !data) throw error ?? new AppError("File not found in storage");

    const buffer = Buffer.from(await data.arrayBuffer());
    res.setHeader("Content-Disposition", `attachment; filename=${file.filename}`);
    res.setHeader("Content-Type", data.type);
    res.send(buffer);
}

export const getDeleteFile = async (
    req: Request<{fileId: string}>, 
    res: Response, 
    next: NextFunction
) => {
    const fileId = parseInt(req.params.fileId);

    //Delete operation (DB)
    const deletedFile = await deleteFile(fileId);

    //Delete operation (Supabase storage)
    const {data, error} = await supabase.storage.from("files").remove([deletedFile.supabasePath]);
    if(error) throw error;

    res.redirect(`/folder/list/${deletedFile.childOfFolderId}`);
}