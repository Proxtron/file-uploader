import express from "express";
import "dotenv/config";
import path from "node:path";
import type { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "../prisma/prisma.js"
import indexRouter from "./routes/indexRouter.js";
import userRouter from "./routes/userRouter.js";
import passportConfig from "./config/passportConfig.js";
import { checkAuthentication } from "./middleware/middleware.js";
import fileRouter from "./routes/fileRouter.js";
import folderRouter from "./routes/folderRouter.js";
import { AppError } from "./error/error.js";

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(import.meta.dirname, "public");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: new PrismaSessionStore(prisma, {}),  
    secret: "cats", 
    resave: false, 
    saveUninitialized: false
}));

app.use(passport.session());
app.use(flash());

passportConfig();

app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.user = req.user;
    res.locals.errors = req.flash("errors");
    next();
});

//Routers
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/file", checkAuthentication(), fileRouter);
app.use("/folder", checkAuthentication(), folderRouter);

//Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof AppError) {
        return res.status(err.statusCode).render("error", {message: err.message});
    }
    console.error(err);
    res.status(500).render("error", {message: "Something went wrong"});
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Listening on port 3000")
});