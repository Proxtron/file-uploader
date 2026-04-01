import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const basePath = path.join(import.meta.dirname, "../public/uploads/");
        if(!req.user) return cb(new Error("User not found to associate folder with"), basePath);
        const userId = req.user.id;

        const uploadPath = `${basePath}/${userId}/`
        fs.mkdirSync(uploadPath);
        return cb(null, uploadPath);
    }
});

export const upload = multer({storage});

