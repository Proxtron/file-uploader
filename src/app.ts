import express from "express";
import "dotenv/config";
import path from "node:path";
import { Strategy as LocalStrategy} from "passport-local";
import type { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcrypt";
import flash from "connect-flash";
import { getUserFromUsername, getUserWithId } from "./db/user.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "../prisma/prisma.js"
import indexRouter from "./routes/indexRouter.js";
import userRouter from "./routes/userRouter.js";

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

passport.use(new LocalStrategy( async (username, password, done) =>  {
    try {
        const user = await getUserFromUsername(username);

        if(!user) {
            return done(null, false, {message: "Name or password is incorrect"});
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);
        if(!passwordCorrect) {
            return done(null, false, {message: "Name or password is incorrect"});
        }

        return done(null, user);
    } catch(error) {
        done(error);
    }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await getUserWithId(id);

    if(!user) {
        return done(null, false);
    }

    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.user = req.user;
    console.clear();
    console.log(req.user);
    console.log(req.session);
    next();
});

//Routers
app.use("/", indexRouter);
app.use("/user", userRouter);

//Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).render("error", {message: "Something went wrong"});
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Listening on port 3000")
});