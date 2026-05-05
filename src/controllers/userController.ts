import { Request, Response, NextFunction } from "express"
import { addUser } from "../db/user.js";
import { hash } from "bcrypt";
import { createRootFolder } from "../db/folder.js";

export const getRegister = (req: Request, res: Response, next: NextFunction) => {
    res.render("register");
}

export const postRegister = async (req: Request<{}, {}, {
    username: string,
    password: string
}>, res: Response, next: NextFunction) => {
    const {username, password} = req.body;
    const hashedPassword = await hash(password, 5);
    
    const newUser = await addUser(username, hashedPassword);
    await createRootFolder(newUser.id);
    
    res.redirect("/");
}

export const getSignIn = (req: Request, res: Response, next: NextFunction) => {
    res.locals.flash = req.flash();
    res.render("sign-in")
}

export const getSignOut = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if(err) return next(err);
        res.redirect("/");
    });
}