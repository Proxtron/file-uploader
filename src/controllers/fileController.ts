import { Request, Response, NextFunction } from "express"
import { addFile, getFileById } from "../db/file";


export const getAddFile = (req: Request, res: Response, next: NextFunction) => {
    res.render("add-file");
}

export const postAddFile = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.user) {
        throw new Error("No user found when adding file record to the database");
    }

    if(!req.file) {
        throw new Error("No file found when attemping to add file record to the database");
    }

    const postedByUserId = req.user.id;
    const {originalname, filename, size } = req.file
    await addFile(originalname, filename, postedByUserId, size);
    res.redirect("/");
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