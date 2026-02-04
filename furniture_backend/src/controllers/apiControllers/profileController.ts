import { Request, Response, NextFunction } from "express";
import { body, query, validationResult } from "express-validator";
import { authorize } from "../../utils/authorize";
import { getUserById, updateUser } from "../../services/authService";
import { checkUser, checkUserIfNotExist } from "../../utils/auth";
import { errorCode } from "../../config/errorCode";
import { createError } from "../../utils/error";
import { checkFile } from "../../utils/check";
import { unlink } from "node:fs/promises";
import path from "path";
import sharp from "sharp";
import imageQueue from "../../jobs/queues/imageQueue";
interface CustomReq extends Request {
  userId?: number;
  file?: any;
}

export const changeLanguage = [
  query("lng", "Invalid language code")
    .trim()
    .notEmpty()
    .matches(/^[a-z]+$/)
    .isLength({ min: 2, max: 3 }),
  (req: CustomReq, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { lng } = req.query;
    res.cookie("i18next", lng);
    res.status(200).json({ message: req.t("langChange", { lang: lng }) });
  },
];

export const testPermission = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);
  const info: any = {
    title: "Testing Permission",
  };
  const access = authorize(true, user!.role, "AUTHOR");

  if (access == true) {
    info.content = "You have a permission";
  }
  res.status(200).json({ info });
};

export const uploadProfile = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const image = req.file;
  const user = await getUserById(userId);
  checkUserIfNotExist(user);
  checkFile(image);
  // console.log("File----->", image);
  const fileName = image!.filename;

  if (user?.image) {
    try {
      const filePath = path.join(
        __dirname,
        "../../..",
        "/uploads/images",
        user!.image
      );
      await unlink(filePath);
    } catch (error) {
      console.log(error);
    }
  }
  const userData = {
    image: fileName,
  };
  await updateUser(user!.id, userData);
  res.status(200).json({ message: "Profile picture uploaded successfully" });
};

export const uploadProfileMultiple = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  // const userId = req.userId;
  const image = req.file;
  // const user = getUserById(userId);
  // checkUserIfNotExist(user);
  console.log("File-----", image);
  res.status(200).json({
    message: "Multiple picture uploaded successfully",
  });
};

export const uploadProfileOptimization = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const image = req.file;
  const user = await getUserById(userId);
  checkUserIfNotExist(user);
  checkFile(image);
  const fileName = image?.filename.split(".")[0];
  const job = await imageQueue.add(
    "optimizeImage ",
    {
      filePath: req.file?.path,
      fileName: `${fileName}.webp`,
      width: 200,
      height: 200,
      quality: 50,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  );

  // try {
  //   const optimizedImagePath = path.join(
  //     __dirname,
  //     "../../..",
  //     "/uploads/images",
  //     fileName
  //   );
  //   await sharp(req.file?.buffer)
  //     .resize(200, 200)
  //     .webp({ quality: 50 })
  //     .toFile(optimizedImagePath);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ message: "Image Optimization Failed" });
  //   return;
  // }

  if (user?.image) {
    try {
      const originalFilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/images",
        user!.image!
      );
      const optimizedFilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/optimize",
        user!.image!.split(".")[0] + ".webp"
      );
      // console.log("Original ===>", originalFilePath);
      // console.log("Optimized ===>", optimizedFilePath);
      await unlink(originalFilePath);
      await unlink(optimizedFilePath);
    } catch (error) {
      console.log(error);
    }
  }
  const userData = {
    image: req.file.filename,
  };
  await updateUser(user?.id!, userData);
  res.status(200).json({
    message: "Optimized picture uploaded successfully",
    image: fileName + ".webp",
    jobId: job.id,
  });
};
