import { Request } from "express";
import multer from "multer";

const ALLOWED_MIMETYPES = [
  "audio/webm",
  "audio/wav",
  "audio/mp4",
  "audio/mpeg",
  "audio/ogg",
  "audio/x-m4a",
];

const storage = multer.memoryStorage(); // store in memory, process it directly

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only audio files are allowed.`
      )
    );
  }
};

export const audioUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});
