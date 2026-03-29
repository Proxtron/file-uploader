import { Router } from "express";
import * as fileController from "../controllers/fileController.js";
import multer from "multer";
import path from "path";
import { param } from "express-validator";


const fileRouter = Router();
const upload = multer({dest: path.join(import.meta.dirname, "../public/uploads/")});

fileRouter.get("/add-file", fileController.getAddFile)
fileRouter.post("/add-file", 
    upload.single("file"), 
    fileController.postAddFile
);

fileRouter.get("/view/:fileId",
    param("fileId").isInt().withMessage("fileId must be an integer (/view/:fileId)"),
    fileController.getViewFile
);

export default fileRouter;