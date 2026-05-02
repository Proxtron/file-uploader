import { Router } from "express";
import * as fileController from "../controllers/fileController.js";
import { param, body } from "express-validator";
import { validateForm, validationResultMiddleware } from "../middleware/middleware.js";
import { upload } from "../config/multerConfig.js";

const fileRouter = Router();

fileRouter.get("/add-file/:parentFolderId", 
    param("parentFolderId").isInt().withMessage("parentFolderId must be an integer (/file/add-file/:parentFolderId"),
    validationResultMiddleware(),
    fileController.getAddFile
);

fileRouter.post("/add-file", 
    upload.single("file"), 
    body("parentFolderId").isInt().withMessage("parentFolderId must be present and an integer"),
    validateForm,
    fileController.postAddFile
);

fileRouter.get("/view/:fileId",
    param("fileId").isInt().withMessage("fileId must be an integer (/file/view/:fileId)"),
    validationResultMiddleware(),
    fileController.getViewFile
);

fileRouter.get("/download/:fileId/:parentFolderId",
    param("fileId").isInt().withMessage("fileId must be an integer (/file/download/:fileId/:parentFolderId)"),
    param("parentFolderId").isInt().withMessage("parentFolderId must be an integer (/file/download/:fileId/:parentFolderId)"),
    validationResultMiddleware(),
    fileController.getDownloadFile
)

fileRouter.get("/delete/:fileId",
    param("fileId").isInt().withMessage("fileId must be an integer (/file/delete/:fileId"),
    validationResultMiddleware(),
    fileController.getDeleteFile
)
export default fileRouter;