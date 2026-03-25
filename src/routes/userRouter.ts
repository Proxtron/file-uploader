import { Router } from "express";
import * as userController from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/register", userController.getRegister)

export default userRouter;