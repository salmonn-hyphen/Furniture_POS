import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../config/errorCode";
import { getUserById } from "../../services/authService";
import { checkUserIfNotExist } from "../../utils/auth";
import { getOrSetCache } from "../../utils/cache";
import { getPostWithRelations } from "../../services/postService";
import { checkModelIfExist } from "../../utils/check";
import {
  getProductList,
  getProductWithRelations,
} from "../../services/productService";

interface CustomRequest extends Request {
  userId?: number;
}

export const getProducts = [
  param("id", "Product Id is required!").isInt({ gt: 0 }),
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const error = validationResult(req).array({ onlyFirstError: true });
    //if the validation error occurs
    if (error.length > 0) {
      return next(createError(error[0].msg, 400, errorCode.invalid));
    }
    const productId = req.params.id;
    const userId = req.userId;
    const user = await getUserById(userId);
    checkUserIfNotExist(user);

    const cacheKey = `posts:${JSON.stringify(productId)}`;
    const product = await getOrSetCache(cacheKey, async () => {
      return await getProductWithRelations(+productId, user!.id);
    });
    checkModelIfExist(product);

    res.status(200).json({ message: "The Post Detail is", product });
  },
];

export const getProductsByPagination = [
  query("cursor", "Cursor must be product Id!").isInt({ gt: 0 }).optional(),
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
    const category = req.query.category;
    const type = req.query.type;

    const userId = req.userId;
    const user = await getUserById(userId);
    checkUserIfNotExist(user);

    let categoryList: number[] = [];
    let typeList: number[] = [];

    if (category) {
      categoryList = category
        .toString()
        .split(",")
        .map((c) => Number(c))
        .filter((c) => c > 0);
    }

    if (type) {
      typeList = type
        .toString()
        .split(",")
        .map((t) => Number(t))
        .filter((t) => t > 0);
    }

    const where = {
      AND: [
        categoryList.length > 0 ? { categoryId: { in: categoryList } } : {},
        typeList.length > 0 ? { typeId: { in: typeList } } : {},
      ],
    };

    const option = {
      where,
      take: +limit + 1,
      skip: lastCursor ? 1 : 0,
      cursor: lastCursor ? { id: +lastCursor } : undefined,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        discount: true,
        status: true,
        images: {
          select: {
            id: true,
            path: true,
          },
          take: 1,
        },
      },
      orderBy: { id: "desc" },
    };

    const cacheKey = `posts:${JSON.stringify(req.query)}`;
    const products = await getOrSetCache(cacheKey, async () => {
      return await getProductList(option);
    });

    const hasNextPage = products.length > +limit;
    if (hasNextPage) {
      products.pop();
    }
    const nextCursor =
      products.length > 0 ? products[products.length - 1].id : null;
    res.status(200).json({
      message: "Get All infinite posts",
      hasNextPage,
      nextCursor,
      prevCursor: lastCursor,
      products,
    });
  },
];
