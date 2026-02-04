import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { errorCode } from "../../config/errorCode";
import { createError } from "../../utils/error";
import { getUserById } from "../../services/authService";
import { checkUserIfNotExist } from "../../utils/auth";
import { checkFile, checkModelIfExist } from "../../utils/check";
import {
  createOnePost,
  deleteOnePost,
  getPostById,
  PostArgs,
  updateOnePost,
} from "../../services/postService";
import sanitizeHtml from "sanitize-html";
import path from "node:path";
import { unlink } from "node:fs/promises";
import imageQueue from "../../jobs/queues/imageQueue";
import { cacheQueue } from "../../jobs/queues/cacheQueue";

interface CustomReq extends Request {
  user: any;
  userId?: number;
  file?: any;
}
const removeFiles = async (
  originalFile: string,
  optimizedFile: string | null,
) => {
  try {
    const originalFilePath = path.join(
      __dirname,
      "../../..",
      "/uploads/images",
      originalFile,
    );
    await unlink(originalFilePath);

    if (optimizedFile) {
      const optimizedFilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/optimize",
        optimizedFile,
      );

      await unlink(optimizedFilePath);
    }
  } catch (error) {
    console.log(error);
  }
};

export const createPost = [
  body("title", "Title is required").trim().notEmpty().escape(),
  body("content", "Content is required").trim().notEmpty().escape(),
  body("body", "Body is required.")
    .trim()
    .notEmpty()
    .customSanitizer((value) => sanitizeHtml(value))
    .notEmpty(),
  body("category", "Category is required").trim().notEmpty().escape(),
  body("type", "Type is required").trim().notEmpty().escape(),
  body("tags", "Tag is invalid")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value) {
        return value.split(",").filter((tag: string) => tag.trim() !== "");
      }
      return value;
    }),
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      if (req.file) {
        await removeFiles(req.file.filename, null);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { title, content, body, category, type, tags } = req.body;
    const user = req.user;

    const image = req.file;
    checkFile(image);
    // const user = await getUserById(userId);
    // if (!user) {
    //   return next(
    //     createError(
    //       "This phone has not registered",
    //       401,
    //       errorCode.unauthenticated,
    //     ),
    //   );
    // }

    const fileName = image?.filename.split(".")[0];
    const job = await imageQueue.add(
      "optimizeImage ",
      {
        filePath: req.file?.path,
        fileName: `${fileName}.webp`,
        width: 835,
        height: 577,
        quality: 100,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    );
    const data: PostArgs = {
      title,
      content,
      body,
      image: req.file.filename,
      authorId: user!.id,
      category,
      type,
      tags,
    };
    const post = await createOnePost(data);
    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "posts:*",
      },
      {
        jobId: `Invalidate-${Date.now()}`,
        priority: 1,
      },
    );
    res.status(201).json({ message: "Successfully created new post" });
  },
];

export const updatePost = [
  body("postId", "Post Id is required.").isInt({ gt: 0 }),
  body("title", "Title is required.").trim().notEmpty().escape(),
  body("content", "Content is required.").trim().notEmpty().escape(),
  body("body", "Body is required.")
    .trim()
    .notEmpty()
    .customSanitizer((value) => sanitizeHtml(value))
    .notEmpty(),
  body("category", "Category is required.").trim().notEmpty().escape(),
  body("type", "Type is required.").trim().notEmpty().escape(),
  body("tags", "Tag is invalid.")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value) {
        return value.split(",").filter((tag: string) => tag.trim() !== "");
      }
      return value;
    }),
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      if (req.file) {
        await removeFiles(req.file.filename, null);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { postId, title, content, body, category, type, tags } = req.body;
    const user = req.user;
    // const user = await getUserById(userId);

    // //return error if the user does not exist
    // if (!user) {
    //   if (req.file) {
    //     await removeFiles(req.file.filename, null);
    //   }
    //   return next(
    //     createError(
    //       "This phone has not registered",
    //       401,
    //       errorCode.unauthenticated,
    //     ),
    //   );
    // }

    //check is post exist and return error if doesn't
    const post = await getPostById(+postId);
    if (!post) {
      if (req.file) {
        await removeFiles(req.file.filename, null);
      }
      return next(
        createError("The post does not exist", 401, errorCode.invalid),
      );
    }

    //if the user doesn't match with the user who created the post
    if (user.id !== post.authorId) {
      if (req.file) {
        await removeFiles(req.file.filename, null);
      }
      return next(
        createError("This action did not allowed", 403, errorCode.invalid),
      );
    }

    const data: any = {
      title,
      content,
      body,
      image: req.file,
      category,
      type,
      tags,
    };

    if (req.file) {
      data.image = req.file.filename;
      const fileName = req.file.filename.split(".")[0];
      const job = await imageQueue.add(
        "optimizeImage ",
        {
          filePath: req.file?.path,
          fileName: `${fileName}.webp`,
          width: 835,
          height: 577,
          quality: 100,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        },
      );
      const optimizedFile = post.image.split(".")[0] + ".webp";
      await removeFiles(post.image, optimizedFile);
    }
    await updateOnePost(post.id, data);
    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "posts:*",
      },
      {
        jobId: `Invalidate-${Date.now()}`,
        priority: 1,
      },
    );
    res
      .status(200)
      .json({ message: "Successfully updated the post", postId: postId });
  },
];

export const deletePost = [
  body("postId", "Invalid id").isInt({ gt: 0 }),
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { postId, user } = req.body;
    // const userId = req.userId;
    // const user = getUserById(userId);
    // if (!user) {
    //   return next(
    //     createError(
    //       "This phone has not registered",
    //       401,
    //       errorCode.unauthenticated,
    //     ),
    //   );
    // }
    const post = await getPostById(+postId);
    await checkModelIfExist(post);

    if (user!.id !== post!.authorId) {
      return next(
        createError("This action did not allowed", 403, errorCode.invalid),
      );
    }
    const deletedPost = await deleteOnePost(postId);
    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "posts:*",
      },
      {
        jobId: `Invalidate-${Date.now()}`,
        priority: 1,
      },
    );
    const optimizedImage = post?.image.split(".")[0] + ".webp";
    await removeFiles(post!.image, optimizedImage);
    res
      .status(201)
      .json({ message: "Successfully deleted a post", postId: post!.id });
  },
];
