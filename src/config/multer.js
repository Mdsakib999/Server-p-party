import multer from "multer";
import { sendResponse } from "../utils/sendResponse.js";

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const limits = { fileSize: 5 * 1024 * 1024 };

const upload = multer({ storage, fileFilter, limits });

export const handleUpload = (type, fieldName, maxCount) => {
  return (req, res, next) => {
    const uploader =
      type === "single"
        ? upload.single(fieldName)
        : upload.array(fieldName, maxCount);

    uploader(req, res, (err) => {
      if (err) {
        if (
          err instanceof multer.MulterError &&
          err.code === "LIMIT_FILE_SIZE"
        ) {
          return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "File too large. Max size is 5MB.",
          });
        }

        return sendResponse(res, {
          statusCode: 400,
          success: false,
          message: err.message,
        });
      }
      next();
    });
  };
};
