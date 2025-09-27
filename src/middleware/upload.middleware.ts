
import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(16).toString("hex");
        const fileExtension = path.extname(file.originalname);
        cb(null, randomName + fileExtension);
    },
});

export const upload = multer({ storage: storage });
