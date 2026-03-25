import { Request, Response, NextFunction } from "express"

export const getRegister = (req: Request, res: Response, next: NextFunction) => {
    res.render("register");
}