import type { RequestHandler } from "express";
import multer from "multer";
import AppError from "../lib/errors.js";

export const upload: RequestHandler = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },

  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new AppError(
          400,
          "INVALID_FILE_TYPE",
          `"${file.originalname}" não é uma imagem JPG, PNG ou WebP`,
        ),
      );
    }

    return callback(null, true);
  },
}).array("images", 5);
