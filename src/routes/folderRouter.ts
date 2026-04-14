import { Router } from "express";
import { body, Meta, param } from "express-validator";
import { validationResultMiddleware } from "../middleware/middleware.js";
import * as folderController from "../controllers/folderController.js";
import { getChildrenOfFolderWithoutUser } from "../db/folder.js";
import type { Request } from "express";

interface CreateFolderBody {
    foldername: string, 
    childOfFolderId: string
};

const folderRouter = Router();

const folderChildValidator = async (foldername: string, meta: Meta) => {
    const body = meta.req.body as CreateFolderBody;
    const childOfFolderId = parseInt(body.childOfFolderId);

    const folderChildren = await getChildrenOfFolderWithoutUser(childOfFolderId);
    if(!folderChildren) throw new Error();

    for(const subfolder of folderChildren.subFolders) {
        if(subfolder.foldername === foldername) {
            throw new Error();
        }
    }
}

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
    body("foldername").custom(folderChildValidator).withMessage("Folder already exists in this directory."),
    validationResultMiddleware("create-folder", (req: Request<{}, {}, CreateFolderBody>) => ({childOfFolderId: req.body.childOfFolderId})),
    folderController.createFolder
);

folderRouter.get("/delete/:folderId",
    param("folderId").isInt().withMessage("folderId must be an integer (/folder/delete/:folderId"),
    validationResultMiddleware("error"),
    folderController.deleteFolder
)

folderRouter.post("/update",
    body("folderId").isInt().withMessage("folderId must be an integer"),
    body("newFolderName").trim().notEmpty().withMessage("newFolderName is required"),
    validationResultMiddleware("error"),
    folderController.postUpdateFolder
)

export default folderRouter;