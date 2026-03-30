import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const checkAuthentication = (redirectRoute: string = "/user/sign-in") => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(req.isAuthenticated()) {
            next();
        } else {
            return res.status(401).redirect(redirectRoute);
        }
    }
}

export const validationResultMiddleware = (view: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array().map((error) => error.msg);
        if(errors.length > 0) {
            if(view === "error") {
                return res.status(400).render(view, {message: errors[0]});
            } else {
                return res.status(400).render(view, {errors});
            }
        } else {
            next();
        }
    }
}