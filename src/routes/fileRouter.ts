import { NextFunction, Router, Request, Response, } from "express";
import * as fileController from "../controllers/fileController.js";
import { Meta, param, body } from "express-validator";
import { getFileById } from "../db/file.js";
import { validationResultMiddleware } from "../middleware/middleware.js";
import { upload } from "../config/multerConfig.js";

const fileRouter = Router();

const checkFileValidator = async (fileId: string, meta: Meta) => {
    const file = await getFileById(parseInt(fileId));
    console.log(file);
    if(!file) throw new Error("File not found or not accessible")
}

fileRouter.get("/add-file/:parentFolderId", 
    param("parentFolderId").isInt().withMessage("parentFolderId must be an integer (/file/add-file/:parentFolderId"),
    fileController.getAddFile
);

fileRouter.post("/add-file", 
    upload.single("file"), 
    body("parentFolderId").isInt().withMessage("parentFolderId must be present and an integer"),
    validationResultMiddleware("error"),
    fileController.postAddFile
);

fileRouter.get("/view/:fileId",
    param("fileId").isInt().withMessage("fileId must be an integer (/file/view/:fileId)"),
    param("fileId").custom(checkFileValidator).withMessage("File not found or not accessible"),
    validationResultMiddleware("error"),
    fileController.getViewFile
);

fileRouter.get("/download/:fileId/:parentFolderId",
    param("fileId").isInt().withMessage("fileId must be an integer (/file/download/:fileId/:parentFolderId)"),
    param("fileId").custom(checkFileValidator).withMessage("File not found or not accessible"),
    param("parentFolderId").isInt().withMessage("parentFolderId must be an integer (/file/download/:fileId/:parentFolderId)"),
    validationResultMiddleware("error"),
    fileController.getDownloadFile
)

fileRouter.get("/delete/:fileId",
    param("fileId").isInt().withMessage("fileId must be an integer (/file/delete/:fileId"),
    validationResultMiddleware("error"),
    fileController.getDeleteFile
)
export default fileRouter;