import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import { ErrnoException } from "../interfaces/exception.interfaces";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const cloudinaryUpload = (
  file: string,
  cloudinaryFolder: string,
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const BYTES_PER_MB = 1024 ** 2;

    const fileStats = await fs.promises.stat(file);

    const fileSizeInMb = fileStats.size / BYTES_PER_MB;

    if (fileSizeInMb > 10.0) reject("File is larger than 10 MB");
    else {
      cloudinary.uploader
        .upload(file, {
          use_filename: true,
          folder: cloudinaryFolder,
          resource_type: "auto",
        })
        .then((result) => {
          resolve(result.secure_url);

          fs.unlink(file, resultHandler);
        })
        .catch((error) => {
          reject(error);

          fs.unlink(file, resultHandler);
        });
    }
  });
};

export const cloudinaryDelete = (file: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let resourceType: string;

    if (
      /\.(jpg|jpeg|png|webp|avif|svg|gif|bmp|JPG|JPEG|PNG|WEBP|AVIF|SVG|GIF|BMP)$/.test(
        file,
      ) == true
    ) {
      resourceType = "image";
    } else {
      resourceType = "video";
    }

    const secondLastIndex = file.lastIndexOf("/", file.lastIndexOf("/") - 1);

    const asset = file
      .substring(secondLastIndex + 1, file.lastIndexOf("."))
      .replace("%2B", "+")
      .replace("%40", "@");

    cloudinary.uploader
      .destroy(asset, {
        resource_type: resourceType,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default cloudinaryUpload;

const resultHandler = function (error: ErrnoException | null) {
  if (error) {
    console.log("Failed to unlink file", error);
  } else {
    console.log("File deleted");
  }
};
