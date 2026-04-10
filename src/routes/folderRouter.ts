import { Router } from "express";
import multer from "multer";
import { body, param } from "express-validator";
import { validationResultMiddleware } from "../middleware/middleware.js";
import * as folderController from "../controllers/folderController.js";

const folderRouter = Router();

folderRouter.get("/", folderController.getRootFolderChildren);

folderRouter.get("/list/:folderId", 
    param("folderId").isInt().withMessage("folderId must be an integer (/folder/list/:folderId)"),
    validationResultMiddleware("error"),
    folderController.getFolderChildren
);

folderRouter.get("/create/:childOfFolderId",
    param("childOfFolderId").isInt().withMessage("childOfFolderId must be an integer (/folder/list/:childOfFolderId"),
    folderController.createFolderForm
)

folderRouter.post("/create",
    body("foldername").trim().notEmpty().withMessage("foldername is required"),
    body("childOfFolderId").isInt().withMessage("childOfFolderId must be an integer"),
    validationResultMiddleware("create-folder"),
    folderController.createFolder
);

export default folderRouter;