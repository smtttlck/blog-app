import multer from "multer";
import fs from "fs";
import path from "path";

const createStorage = (uploadFile: string): multer.StorageEngine => multer.diskStorage({ // multer disk storage
    destination: (_req, _file, cb): void => { // path for image files
        const uploadPath: string = `public/uploads/${uploadFile}`;
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (_req, file, cb): void => { // file name
        const ext: string = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

export const createMulter = (uploadFile: string): multer.Multer => multer({ // multer settings
    storage: createStorage(uploadFile),
    limits: { fileSize: 1024 * 1024 * 5 }, // max size limit 5 mb for file
    fileFilter: (_req, file, cb): void => { // check file type
        if (file.mimetype.startsWith('image/'))
            cb(null, true);
        else
            cb(new Error('Only image files are accepted.'));
    }
});
