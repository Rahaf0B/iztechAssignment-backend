import { Request, Response, NextFunction } from "express";

import imagekit from "../config/imageUploadConfiguration";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() }).single("image");

async function imageUploader(
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (req.file) {
    await imagekit.upload(
      {
        file: req.file.buffer, 
        fileName: req.file.originalname, 
        folder: "profile-picture", 
      },
      function (err, response) {
        if (err) {
            return res.status(500).send({
              message: "An error occured during file upload. Please try again.",
            });
        }
        req.url=response.url;
        next();
      }
    );
  }
}
export default{upload,imageUploader}
