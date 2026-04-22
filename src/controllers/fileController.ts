import { Request, Response, NextFunction } from "express"
import { addFile, getFileById } from "../db/file";


export const getAddFile = (req: Request<{parentFolderId: string}>, res: Response, next: NextFunction) => {
    const parentFolderId = parseInt(req.params.parentFolderId);
    res.render("add-file", {parentFolderId});
}

export const postAddFile = async (req: Request<{}, {}, {parentFolderId: string}>, res: Response, next: NextFunction) => {
    if(!req.file) {
        throw new Error("No uploaded file found when attemping to add file record to the database");
    }

    const parentFolderId = parseInt(req.body.parentFolderId);
    const {originalname, filename, size } = req.file;
    await addFile(originalname, filename, parentFolderId, size);
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

export const getDownloadFile = async (req: Request<{fileId: string}>, res: Response, next: NextFunction) => {
    const fileId = parseInt(req.params.fileId);
    const file = await getFileById(fileId);
    if(!file) {
        return res.status(404).send("File not found");
    }

    const basePath = `src/public/uploads/${req.user!.id}/`;
    res.download(basePath + file.filename, file.originalFilename);
}