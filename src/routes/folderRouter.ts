import { Router } from "express";
import multer from "multer";
import path from "path";
import { Meta, param } from "express-validator";
import { getFileByIdAndUser } from "../db/file.js";
import { validationResultMiddleware } from "../middleware/middleware.js";
import * as folderController from "../controllers/folderController.js";


const folderRouter = Router();

folderRouter.get("/", folderController.getRootFolderChildren);

folderRouter.get("/list/:folderId", 
    param("folderId").isInt().withMessage("folderId must be an integer (/folder/list/:folderId)"),
    validationResultMiddleware("error"),
    folderController.getFolderChildren
);

export default folderRouter;