import { Router } from "express";
import { body, param } from "express-validator";
import { validateForm, validationResultMiddleware } from "../middleware/middleware.js";
import * as folderController from "../controllers/folderController.js";

const folderRouter = Router();

folderRouter.get("/", folderController.getRootFolderChildren);

folderRouter.get("/list/:folderId", 
    param("folderId").isInt().withMessage("folderId must be an integer (/folder/list/:folderId)"),
    validationResultMiddleware(),
    folderController.getFolderChildren
);

folderRouter.get("/create/:childOfFolderId",
    param("childOfFolderId").isInt().withMessage("childOfFolderId must be an integer (/folder/list/:childOfFolderId"),
    validationResultMiddleware(),
    folderController.createFolderForm
)

folderRouter.post("/create",
    body("foldername").trim().notEmpty().withMessage("foldername is required"),
    body("childOfFolderId").isInt().withMessage("childOfFolderId must be an integer"),
    validateForm,
    folderController.createFolder
);

folderRouter.get("/delete/:folderId",
    param("folderId").isInt().withMessage("folderId must be an integer (/folder/delete/:folderId"),
    validationResultMiddleware(),
    folderController.deleteFolder
)

folderRouter.post("/update",
    body("folderId").isInt().withMessage("folderId must be an integer"),
    body("newFolderName").trim().notEmpty().withMessage("newFolderName is required"),
    validateForm,
    folderController.postUpdateFolder
)

folderRouter.get("/update/:folderId",
    param("folderId").isInt().withMessage("folderId must be an integer (/folder/update/:folderId"),
    validationResultMiddleware(),
    folderController.getUpdateFolder
)


export default folderRouter;