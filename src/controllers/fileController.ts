import { Request, Response, NextFunction } from "express"

export const getAddFile = (req: Request, res: Response, next: NextFunction) => {
    res.render("add-file");
}

export const postAddFile = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file);
    console.log(req.body);
    res.redirect("/")
}