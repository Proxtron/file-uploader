import { Request, Response, NextFunction } from "express"
import { addUser } from "../db/user";
import { hash } from "bcrypt";

export const getRegister = (req: Request, res: Response, next: NextFunction) => {
    res.render("register");
}

export const postRegister = async (req: Request<{}, {}, {
    username: string,
    password: string
}>, res: Response, next: NextFunction) => {
    const {username, password} = req.body;
    const hashedPassword = await hash(password, 5);
    await addUser(username, hashedPassword);
    res.render("index");
}