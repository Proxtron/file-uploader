import { Router } from "express";
import * as fileController from "../controllers/fileController.js";
import { Meta, param } from "express-validator";
import { getFileByIdAndUser } from "../db/file.js";
import { validationResultMiddleware } from "../middleware/middleware.js";
import { upload } from "../config/multerConfig.js";


const fileRouter = Router();

const checkFileValidator = async (fileId: string, meta: Meta) => {
    const userId = meta.req.user.id as number;
    const file = await getFileByIdAndUser(parseInt(fileId), userId);
    console.log(file);
    if(!file) throw new Error("File not found or not accessible")
}

fileRouter.get("/add-file", fileController.getAddFile)
fileRouter.post("/add-file", 
    upload.single("file"), 
    fileController.postAddFile
);

fileRouter.get("/view/:fileId",
    param("fileId").isInt().withMessage("fileId must be an integer (/file/view/:fileId)"),
    param("fileId").custom(checkFileValidator).withMessage("File not found or not accessible"),
    validationResultMiddleware("error"),
    fileController.getViewFile
);

fileRouter.get("/download/:fileId",
    param("fileId").isInt().withMessage("fileId must be an integer (/file/download/:fileId)"),
    param("fileId").custom(checkFileValidator).withMessage("File not found or not accessible"),
    validationResultMiddleware("error"),
    fileController.getDownloadFile
)

export default fileRouter;