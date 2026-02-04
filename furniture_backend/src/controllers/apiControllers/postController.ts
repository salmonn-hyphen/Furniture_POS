import { create } from "domain";
import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../config/errorCode";
import { getOtpByPhone, getUserById } from "../../services/authService";
import { checkUserIfNotExist } from "../../utils/auth";
import { getPostList, getPostWithRelations } from "../../services/postService";
import { checkModelIfExist } from "../../utils/check";
import { getOrSetCache } from "../../utils/cache";

interface CustomRequest extends Request {
  userId?: number;
}

export const getPost = [
  param("id", "Post Id is required!").isInt({ gt: 0 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const error = validationResult(req).array({ onlyFirstError: true });
    //if the validation error occurs
    if (error.length > 0) {
      return next(createError(error[0].msg, 400, errorCode.invalid));
    }
    const postId = req.params.id;
    const userId = req.userId;
    const user = await getUserById(userId);
    checkUserIfNotExist(user);

    const cacheKey = `posts:${JSON.stringify(postId)}`;
    const post = await getOrSetCache(cacheKey, async () => {
      return await getPostWithRelations(+postId);
    });
    checkModelIfExist(post);

    res.status(200).json({ message: "The Post Detail is", post });
  },
];

export const getPostsByPagination = [
  query("page", "Page number must be unsigned number!")
    .isInt({ gt: 0 })
    .optional(),
  query("limit", "Limit number must be unsigned number!")
    .isInt({ gt: 4 })
    .optional(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const error = validationResult(req).array({ onlyFirstError: true });
    //if the validation error occurs
    if (error.length > 0) {
      return next(createError(error[0].msg, 400, errorCode.invalid));
    }
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const userId = req.userId;
    const user = await getUserById(userId);
    checkUserIfNotExist(user);

    const skip = (+page - 1) * +limit;
    const option = {
      skip,
      take: +limit + 1,
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        updatedAt: true,
        author: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    };
    const cacheKey = `post:${JSON.stringify(req.query)}`;
    const posts = await getOrSetCache(cacheKey, async () => {
      return await getPostList(option);
    });

    const hasNextPage = posts.length > +limit;
    let nextPage = null;
    const previousPage = +page !== 1 ? +page - 1 : null;
    if (hasNextPage) {
      posts.pop();
      nextPage = +page + 1;
    }
    res.status(200).json({
      message: "Get All Posts",
      currentPage: page,
      previousPage,
      hasNextPage,
      nextPage,
      posts,
    });
  },
];

export const getInfinitePostsByPagination = [
  query("cursor", "Cursor must be post Id!").isInt({ gt: 0 }).optional(),
  query("limit", "Limit number must be unsigned number!")
    .isInt({ gt: 4 })
    .optional(),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const error = validationResult(req).array({ onlyFirstError: true });
    //if the validation error occurs
    if (error.length > 0) {
      return next(createError(error[0].msg, 400, errorCode.invalid));
    }

    const lastCursor = req.query.cursor;
    const limit = req.query.limit || 5;
    const userId = req.userId;
    const user = await getUserById(userId);
    checkUserIfNotExist(user);
    const option = {
      take: +limit + 1,
      skip: lastCursor ? 1 : 0,
      cursor: lastCursor ? { id: +lastCursor } : undefined,
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        updatedAt: true,
        author: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { id: "desc" },
    };

    // const posts = await getPostList(option);

    const cacheKey = `posts:${JSON.stringify(req.query)}`;
    const posts = await getOrSetCache(cacheKey, async () => {
      return await getPostList(option);
    });

    const hasNextPage = posts.length > +limit;
    if (hasNextPage) {
      posts.pop();
    }
    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;
    res.status(200).json({
      message: "Get All infinite posts",
      hasNextPage,
      nextCursor,
      prevCursor: lastCursor,
      posts,
    });
  },
];
