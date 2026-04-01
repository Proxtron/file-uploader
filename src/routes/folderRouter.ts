import { Router } from "express";
import multer from "multer";
import path from "path";
import { Meta, param } from "express-validator";
import { getFileByIdAndUser } from "../db/file.js";
import { validationResultMiddleware } from "../middleware/middleware.js";


// const folderRouter = Router();




// folderRouter.get("/new", );
// export default folderRouter;