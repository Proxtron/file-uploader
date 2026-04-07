import { Router } from "express";
import multer from "multer";
import path from "path";
import { Meta, param } from "express-validator";
import { getFileByIdAndUser } from "../db/file.js";
import { validationResultMiddleware } from "../middleware/middleware.js";
import * as folderController from "../controllers/folderController.js";


const folderRouter = Router();

folderRouter.get("/", folderController.getRootFolderChildren);

folderRouter.get("/list-children/:folderId", 
    param("folderId").isInt().withMessage("fileId must be an integer (/folder/list-children/:folderId)"),
    // param("fileId").custom(checkFileValidator).withMessage("File not found or not accessible"),
    folderController.getFolderChildren
);
export default folderRouter;