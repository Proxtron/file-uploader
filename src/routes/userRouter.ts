import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { body } from "express-validator";
import { validationResultMiddleware } from "../middleware/middleware.js";
import { getUserFromUsername } from "../db/user.js";


const userRouter = Router();

userRouter.get("/register", userController.getRegister)
userRouter.post("/register", 
    body("username").trim().notEmpty().withMessage("Username is a required field"),
    body("password").trim().notEmpty().withMessage("Password is a required field"),
    body("username").custom(async (username) => {
        const user = await getUserFromUsername(username)
        return user;
    }).withMessage("User with username already exists"),
    validationResultMiddleware("register"),
    userController.postRegister
);

export default userRouter;