import { Request, Response, NextFunction } from "express"
import { addFile } from "../db/file";

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
    res.redirect("/file/view-files");
}